import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sql = getDb()
    const data = await sql`
      SELECT id, title, slug, category, excerpt, content, image_url, created_at
      FROM features_news
      ORDER BY created_at DESC
    `
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("GET news error:", error)
    return NextResponse.json({ success: false, data: [] })
  }
}
