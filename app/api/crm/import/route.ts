import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { checkEcosystemLimit } from "@/lib/ecosystem-limit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getClientIp } from "@/lib/request-ip"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const limitCheck = await checkEcosystemLimit(request, "crm", 0);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: limitCheck.message },
        { status: 403 }
      )
    }

    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()
    const { csvData } = await request.json()

    if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
      return NextResponse.json(
        { success: false, message: "Data CSV tidak valid" },
        { status: 400 }
      )
    }

    let imported = 0
    let skipped = 0

    for (const row of csvData) {
      try {
        // Skip if email already exists for THIS user
        if (row.email) {
          const existing = await sql`
            SELECT id FROM crm_contacts 
            WHERE email = ${row.email} AND user_email = ${currentUserEmail} 
            LIMIT 1
          `
          if (existing.length > 0) {
            skipped++
            continue
          }
        }

        await sql`
          INSERT INTO crm_contacts (name, email, phone, website, address, category, status, source, user_email)
          VALUES (
            ${row.name || row.nama || "Unknown"},
            ${row.email || null},
            ${row.phone || row.telepon || row.hp || null},
            ${row.website || null},
            ${row.address || row.alamat || null},
            ${row.category || row.kategori || null},
            'NEW',
            'csv_import',
            ${currentUserEmail}
          )
        `
        imported++
      } catch (e) {
        skipped++
      }
    }

    return NextResponse.json({
      success: true,
      message: `${imported} kontak berhasil diimport, ${skipped} dilewati`,
      imported,
      skipped,
    })
  } catch (error: any) {
    console.error("CRM Import error:", error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

