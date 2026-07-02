import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { orderNumbers, email } = await request.json()
    const sql = getDb()

    let rows: any[] = []

    const hasEmail = typeof email === "string" && email.trim() !== ""
    const hasOrderNumbers = Array.isArray(orderNumbers) && orderNumbers.length > 0

    if (hasEmail && hasOrderNumbers) {
      rows = await sql`
        SELECT order_number, title, package, total_price, status, created_at
        FROM orders
        WHERE email = ${email} OR order_number = ANY(${orderNumbers})
        ORDER BY created_at DESC
        LIMIT 20
      `
    } else if (hasEmail) {
      rows = await sql`
        SELECT order_number, title, package, total_price, status, created_at
        FROM orders
        WHERE email = ${email}
        ORDER BY created_at DESC
        LIMIT 20
      `
    } else if (hasOrderNumbers) {
      rows = await sql`
        SELECT order_number, title, package, total_price, status, created_at
        FROM orders
        WHERE order_number = ANY(${orderNumbers})
        ORDER BY created_at DESC
        LIMIT 20
      `
    }

    return NextResponse.json({ success: true, data: rows || [] })
  } catch (error: any) {
    console.error("POST pending-list error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
