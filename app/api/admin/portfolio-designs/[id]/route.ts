import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = getDb()
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, category, image, description } = body

    const result = await sql`
      UPDATE portfolio_designs
      SET 
        title = COALESCE(${title}, title),
        category = COALESCE(${category}, category),
        image = COALESCE(${image}, image),
        description = COALESCE(${description}, description)
      WHERE id = ${params.id}
      RETURNING *
    `

    if (result.length === 0) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("PATCH portfolio-designs error:", error)
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = getDb()
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const result = await sql`DELETE FROM portfolio_designs WHERE id = ${params.id} RETURNING id`
    if (result.length === 0) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 })
    
    return NextResponse.json({ success: true, message: "Deleted successfully" })
  } catch (error) {
    console.error("DELETE portfolio-designs error:", error)
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
