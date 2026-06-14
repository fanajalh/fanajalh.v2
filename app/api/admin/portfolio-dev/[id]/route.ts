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
    const { title, category, type, image, description, tech, color, link, github_link } = body

    const result = await sql`
      UPDATE portfolio_dev
      SET 
        title = COALESCE(${title}, title),
        category = COALESCE(${category}, category),
        type = COALESCE(${type}, type),
        image = COALESCE(${image}, image),
        description = COALESCE(${description}, description),
        tech = COALESCE(${tech}, tech),
        color = COALESCE(${color}, color),
        link = COALESCE(${link}, link),
        github_link = COALESCE(${github_link}, github_link)
      WHERE id = ${params.id}
      RETURNING *
    `

    if (result.length === 0) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("PATCH portfolio-dev error:", error)
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

    const result = await sql`DELETE FROM portfolio_dev WHERE id = ${params.id} RETURNING id`
    if (result.length === 0) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 })
    
    return NextResponse.json({ success: true, message: "Deleted successfully" })
  } catch (error) {
    console.error("DELETE portfolio-dev error:", error)
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
