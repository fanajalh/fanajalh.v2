import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getClientIp } from "@/lib/request-ip"

export const dynamic = 'force-dynamic'

// GET - List campaigns for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()
    const campaigns = await sql`
      SELECT * FROM email_campaigns 
      WHERE user_email = ${currentUserEmail}
      ORDER BY created_at DESC
    `
    return NextResponse.json({ success: true, campaigns })
  } catch (error: any) {
    console.error("Campaign GET error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST - Create campaign for current user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()
    const data = await request.json()

    if (!data.name || !data.subject || !data.template_html) {
      return NextResponse.json(
        { success: false, message: "Nama, subject, dan template wajib diisi" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO email_campaigns (user_email, name, subject, template_html, total_recipients, status)
      VALUES (
        ${currentUserEmail},
        ${data.name},
        ${data.subject},
        ${data.template_html},
        ${data.total_recipients || 0},
        'draft'
      )
      RETURNING *
    `

    return NextResponse.json({ success: true, campaign: result[0] })
  } catch (error: any) {
    console.error("Campaign POST error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
