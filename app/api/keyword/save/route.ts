import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getClientIp } from "@/lib/request-ip"
import { decryptId } from "@/lib/id-cipher"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()
    const { keywords, contact_id, seo_project_id } = await request.json()

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { success: false, message: "Keywords wajib diisi" },
        { status: 400 }
      )
    }

    // Decrypt contact ID if provided
    const contactIdRaw = contact_id ? decryptId(contact_id) : null

    const saved = []
    for (const kw of keywords) {
      const result = await sql`
        INSERT INTO keywords (seo_project_id, contact_id, keyword, search_volume, difficulty, traffic_estimate, user_email)
        VALUES (
          ${seo_project_id || null},
          ${contactIdRaw},
          ${kw.keyword},
          ${kw.volume || null},
          ${kw.difficulty || null},
          ${Math.round((kw.volume || 0) * 0.03)},
          ${currentUserEmail}
        )
        RETURNING *
      `
      saved.push(result[0])
    }

    return NextResponse.json({
      success: true,
      message: `${saved.length} keyword berhasil disimpan`,
      keywords: saved,
    })
  } catch (error: any) {
    console.error("Keyword save error:", error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
