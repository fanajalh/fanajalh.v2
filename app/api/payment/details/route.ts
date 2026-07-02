import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get("orderNumber")

    if (!orderNumber) {
      return NextResponse.json({ success: false, message: "Order number wajib diisi." }, { status: 400 })
    }

    const sql = getDb()
    const rows = await sql`
      SELECT * FROM orders WHERE order_number = ${orderNumber} LIMIT 1
    `

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Pesanan tidak ditemukan." }, { status: 404 })
    }

    const order = rows[0]

    // Fetch bank/QRIS info if available
    let bankInfo = {
      nmid: "",
      bankName: "",
      accountName: "",
      qrisAvailable: false
    };
    try {
      const qrisRows = await sql`
        SELECT nmid, bank_name, account_name, qr_image_base64
        FROM qris_settings
        ORDER BY id DESC
        LIMIT 1
      `;
      if (qrisRows.length > 0) {
        bankInfo.nmid = qrisRows[0].nmid || "";
        bankInfo.bankName = qrisRows[0].bank_name || "";
        bankInfo.accountName = qrisRows[0].account_name || "";
        bankInfo.qrisAvailable = !!qrisRows[0].qr_image_base64;
      }
    } catch (err) {
      console.warn("qris_settings query failed:", err);
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.order_number,
        totalPrice: order.total_price,
        packageId: order.package,
        title: order.title,
        name: order.name,
        email: order.email,
        phone: order.phone,
        status: order.status,
      },
      bankInfo,
    })
  } catch (error: any) {
    console.error("GET payment details error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
