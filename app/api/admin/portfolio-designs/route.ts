import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sql = getDb()
    const data = await sql`SELECT * FROM portfolio_designs ORDER BY created_at DESC`
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("GET portfolio-designs error:", error)
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb()
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, category, image, description } = body

    if (!title || !category || !image) {
      return NextResponse.json({ success: false, message: "Title, category, and image are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO portfolio_designs (title, category, image, description)
      VALUES (${title}, ${category}, ${image}, ${description || null})
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("POST portfolio-designs error:", error)
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
