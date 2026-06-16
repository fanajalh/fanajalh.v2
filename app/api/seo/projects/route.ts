import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getClientIp } from "@/lib/request-ip"

export const dynamic = 'force-dynamic'

// GET - List SEO projects for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()
    const projects = await sql`
      SELECT sp.*, cc.name as contact_name, cc.category as contact_category
      FROM seo_projects sp
      LEFT JOIN crm_contacts cc ON sp.contact_id = cc.id
      WHERE sp.user_email = ${currentUserEmail}
      ORDER BY sp.created_at DESC
    `
    return NextResponse.json({ success: true, projects })
  } catch (error: any) {
    console.error("SEO projects GET error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// DELETE - Delete SEO project owned by current user
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM seo_projects 
      WHERE id = ${id} AND user_email = ${currentUserEmail}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, message: "Project SEO tidak ditemukan atau tidak memiliki akses" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Project SEO berhasil dihapus" })
  } catch (error: any) {
    console.error("SEO project DELETE error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

