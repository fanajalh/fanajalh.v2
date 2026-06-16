import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getClientIp } from "@/lib/request-ip"

export const dynamic = 'force-dynamic'

// GET - Get current user's SMTP settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()
    const settings = await sql`
      SELECT id, user_email, smtp_host, smtp_port, smtp_email, display_name, created_at
      FROM user_smtp_settings WHERE user_email = ${currentUserEmail} LIMIT 1
    `

    return NextResponse.json({
      success: true,
      settings: settings[0] || null,
      configured: settings.length > 0,
    })
  } catch (error: any) {
    console.error("SMTP GET error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST - Save/Update SMTP settings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()
    const data = await request.json()

    if (!data.smtp_email || !data.smtp_password) {
      return NextResponse.json(
        { success: false, message: "Email dan password SMTP wajib diisi" },
        { status: 400 }
      )
    }

    // Upsert: insert or update if exists for current user
    const existing = await sql`
      SELECT id FROM user_smtp_settings WHERE user_email = ${currentUserEmail} LIMIT 1
    `

    let result
    if (existing.length > 0) {
      result = await sql`
        UPDATE user_smtp_settings SET
          smtp_host = ${data.smtp_host || 'smtp.gmail.com'},
          smtp_port = ${data.smtp_port || 587},
          smtp_email = ${data.smtp_email},
          smtp_password = ${data.smtp_password},
          display_name = ${data.display_name || null},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_email = ${currentUserEmail}
        RETURNING id, user_email, smtp_host, smtp_port, smtp_email, display_name
      `
    } else {
      result = await sql`
        INSERT INTO user_smtp_settings (user_email, smtp_host, smtp_port, smtp_email, smtp_password, display_name)
        VALUES (
          ${currentUserEmail},
          ${data.smtp_host || 'smtp.gmail.com'},
          ${data.smtp_port || 587},
          ${data.smtp_email},
          ${data.smtp_password},
          ${data.display_name || null}
        )
        RETURNING id, user_email, smtp_host, smtp_port, smtp_email, display_name
      `
    }

    return NextResponse.json({
      success: true,
      message: "SMTP settings berhasil disimpan",
      settings: result[0],
    })
  } catch (error: any) {
    console.error("SMTP POST error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

