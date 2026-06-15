import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { checkEcosystemLimit } from "@/lib/ecosystem-limit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getClientIp } from "@/lib/request-ip"
import { encryptId, decryptId } from "@/lib/id-cipher"

export const dynamic = 'force-dynamic'

// GET - Single contact detail
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const limitCheck = await checkEcosystemLimit(request, "crm", 0);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: limitCheck.message },
        { status: 403 }
      )
    }

    const decryptedId = decryptId(params.id)
    if (decryptedId === null) {
      return NextResponse.json(
        { success: false, message: "ID kontak tidak valid" },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()
    const contact = await sql`
      SELECT * FROM crm_contacts 
      WHERE id = ${decryptedId} AND user_email = ${currentUserEmail}
    `

    if (contact.length === 0) {
      return NextResponse.json(
        { success: false, message: "Contact tidak ditemukan" },
        { status: 404 }
      )
    }

    // Encrypt ID before sending to client
    contact[0].id = encryptId(contact[0].id)

    return NextResponse.json({ success: true, contact: contact[0] })
  } catch (error: any) {
    console.error("CRM GET detail error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// PATCH - Update contact
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const limitCheck = await checkEcosystemLimit(request, "crm", 0);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: limitCheck.message },
        { status: 403 }
      )
    }

    const decryptedId = decryptId(params.id)
    if (decryptedId === null) {
      return NextResponse.json(
        { success: false, message: "ID kontak tidak valid" },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()
    const data = await request.json()

    const result = await sql`
      UPDATE crm_contacts SET
        name = COALESCE(${data.name || null}, name),
        email = COALESCE(${data.email || null}, email),
        phone = COALESCE(${data.phone || null}, phone),
        website = COALESCE(${data.website || null}, website),
        address = COALESCE(${data.address || null}, address),
        category = COALESCE(${data.category || null}, category),
        status = COALESCE(${data.status || null}, status),
        notes = COALESCE(${data.notes || null}, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${decryptedId} AND user_email = ${currentUserEmail}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Contact tidak ditemukan" },
        { status: 404 }
      )
    }

    // Encrypt ID before returning
    result[0].id = encryptId(result[0].id)

    return NextResponse.json({ success: true, contact: result[0] })
  } catch (error: any) {
    console.error("CRM PATCH error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// DELETE - Delete contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const limitCheck = await checkEcosystemLimit(request, "crm", 0);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: limitCheck.message },
        { status: 403 }
      )
    }

    const decryptedId = decryptId(params.id)
    if (decryptedId === null) {
      return NextResponse.json(
        { success: false, message: "ID kontak tidak valid" },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()
    const result = await sql`
      DELETE FROM crm_contacts 
      WHERE id = ${decryptedId} AND user_email = ${currentUserEmail} 
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Contact tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: "Contact berhasil dihapus" })
  } catch (error: any) {
    console.error("CRM DELETE error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
