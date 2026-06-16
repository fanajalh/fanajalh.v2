import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const sql = getDb();
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const { status } = await request.json()
        if (!status) {
            return NextResponse.json({ success: false, message: "Status harus diisi" }, { status: 400 })
        }

        const result = await sql`
            UPDATE orders SET status = ${status}, updated_at = NOW()
            WHERE id = ${parseInt(params.id)}
            RETURNING *
        `;

        if (result.length === 0) {
            return NextResponse.json({ success: false, message: "Pesanan tidak ditemukan" }, { status: 404 })
        }

        return NextResponse.json({ success: true, order: result[0] })
    } catch (error: any) {
        console.error("PATCH error:", error)
        return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 })
    }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const sql = getDb();
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const result = await sql`DELETE FROM orders WHERE id = ${parseInt(params.id)} RETURNING id`;

        if (result.length === 0) {
            return NextResponse.json({ success: false, message: "Pesanan tidak ditemukan" }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: "Pesanan berhasil dihapus" })
    } catch (error: any) {
        console.error("DELETE error:", error)
        return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 })
    }
}