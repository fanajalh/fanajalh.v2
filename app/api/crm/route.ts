import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { checkEcosystemLimit } from "@/lib/ecosystem-limit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getClientIp } from "@/lib/request-ip"
import { encryptId } from "@/lib/id-cipher"

export const dynamic = 'force-dynamic'

// GET - List contacts with search, filter, pagination
export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    let contacts
    let countResult

    if (search && status) {
      contacts = await sql`
        SELECT * FROM crm_contacts 
        WHERE (name ILIKE ${'%' + search + '%'} OR email ILIKE ${'%' + search + '%'})
        AND status = ${status}
        AND user_email = ${currentUserEmail}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      countResult = await sql`
        SELECT COUNT(*) as total FROM crm_contacts 
        WHERE (name ILIKE ${'%' + search + '%'} OR email ILIKE ${'%' + search + '%'})
        AND status = ${status}
        AND user_email = ${currentUserEmail}
      `
    } else if (search) {
      contacts = await sql`
        SELECT * FROM crm_contacts 
        WHERE (name ILIKE ${'%' + search + '%'} OR email ILIKE ${'%' + search + '%'})
        AND user_email = ${currentUserEmail}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      countResult = await sql`
        SELECT COUNT(*) as total FROM crm_contacts 
        WHERE (name ILIKE ${'%' + search + '%'} OR email ILIKE ${'%' + search + '%'})
        AND user_email = ${currentUserEmail}
      `
    } else if (status) {
      contacts = await sql`
        SELECT * FROM crm_contacts 
        WHERE status = ${status}
        AND user_email = ${currentUserEmail}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      countResult = await sql`
        SELECT COUNT(*) as total FROM crm_contacts 
        WHERE status = ${status} AND user_email = ${currentUserEmail}
      `
    } else {
      contacts = await sql`
        SELECT * FROM crm_contacts 
        WHERE user_email = ${currentUserEmail}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      countResult = await sql`
        SELECT COUNT(*) as total FROM crm_contacts 
        WHERE user_email = ${currentUserEmail}
      `
    }

    const total = parseInt(countResult[0]?.total || "0")

    // Encrypt contact IDs before returning to client
    const mappedContacts = contacts.map(c => ({
      ...c,
      id: encryptId(c.id)
    }))

    return NextResponse.json({
      success: true,
      contacts: mappedContacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("CRM GET error:", error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new contact
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
    const data = await request.json()

    if (!data.name) {
      return NextResponse.json(
        { success: false, message: "Nama wajib diisi" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO crm_contacts (name, email, phone, website, address, category, status, source, notes, user_email)
      VALUES (
        ${data.name}, ${data.email || null}, ${data.phone || null},
        ${data.website || null}, ${data.address || null}, ${data.category || null},
        ${data.status || 'NEW'}, ${data.source || 'manual'}, ${data.notes || null},
        ${currentUserEmail}
      )
      RETURNING *
    `

    await sql`
      INSERT INTO tracking_events (event_type, reference_id, reference_type, metadata, user_email)
      VALUES ('crm_add', ${result[0].id}, 'contact', ${JSON.stringify({ source: data.source || 'manual' })}::jsonb, ${currentUserEmail})
    `

    // Encrypt returned contact ID
    const returnedContact = {
      ...result[0],
      id: encryptId(result[0].id)
    }

    return NextResponse.json({ success: true, contact: returnedContact })
  } catch (error: any) {
    console.error("CRM POST error:", error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
