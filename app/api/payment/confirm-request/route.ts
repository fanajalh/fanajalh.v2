import { type NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { orderNumber } = await request.json();

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: "Nomor transaksi wajib disertakan." },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Update order status to 'waiting_verification'
    const result = await sql`
      UPDATE orders
      SET status = 'waiting_verification', updated_at = NOW()
      WHERE order_number = ${orderNumber} AND status = 'pending'
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Transaksi tidak ditemukan, sudah dikonfirmasi, atau kedaluwarsa." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Permintaan verifikasi dikirim! Admin/sistem akan memverifikasi pembayaran Anda.",
      order: result[0],
    });
  } catch (error: any) {
    console.error("Confirm request error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
