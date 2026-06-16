import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getClientIp } from "@/lib/request-ip"
import { logEcosystemUsage } from "@/lib/ecosystem-limit"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()
    const { leads } = await request.json()

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json(
        { success: false, message: "Data lead tidak valid" },
        { status: 400 }
      )
    }

    const saved = []
    for (const lead of leads) {
      const existing = lead.email
        ? await sql`
            SELECT id FROM crm_contacts 
            WHERE email = ${lead.email} AND user_email = ${currentUserEmail} 
            LIMIT 1
          `
        : []

      if (existing.length > 0) continue

      const result = await sql`
        INSERT INTO crm_contacts (name, email, phone, website, address, category, status, source, user_email)
        VALUES (
          ${lead.title || lead.name || ""},
          ${lead.email || null},
          ${lead.phone || null},
          ${lead.website || null},
          ${lead.address || null},
          ${lead.category || null},
          'NEW',
          'lead_finder',
          ${currentUserEmail}
        )
        RETURNING *
      `
      saved.push(result[0])

      // Log tracking event
      await sql`
        INSERT INTO tracking_events (event_type, reference_id, reference_type, metadata, user_email)
        VALUES ('lead_saved', ${result[0].id}, 'contact', ${JSON.stringify({ source: 'lead_finder', category: lead.category })}::jsonb, ${currentUserEmail})
      `
    }

    return NextResponse.json({
      success: true,
      message: `${saved.length} lead berhasil disimpan ke CRM`,
      saved: saved.length,
      skipped: leads.length - saved.length,
    })
  } catch (error: any) {
    console.error("Lead save error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Gagal menyimpan lead" },
      { status: 500 }
    )
  }
}

