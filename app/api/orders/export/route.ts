import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const sql = getDb();
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`;

        if (orders.length === 0) {
            const csvContent = "Order Number,Name,Email,Phone,Company,Service,Package,Title,Description,Dimensions,Colors,Deadline,Status,Total Price,Created At,Updated At"
            return new NextResponse(csvContent, {
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.csv"`,
                },
            })
        }

        const headers = [
            "Order Number", "Name", "Email", "Phone", "Company", "Service",
            "Package", "Title", "Description", "Dimensions", "Colors",
            "Deadline", "Status", "Total Price", "Created At", "Updated At",
        ]

        const csvContent = [
            headers.join(","),
            ...orders.map((order: any) =>
                [
                    order.order_number,
                    `"${order.name}"`,
                    order.email,
                    order.phone,
                    `"${order.company || ""}"`,
                    order.service,
                    order.package,
                    `"${order.title || ""}"`,
                    `"${String(order.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                    `"${order.dimensions || ""}"`,
                    `"${order.colors || ""}"`,
                    order.deadline,
                    order.status,
                    order.total_price,
                    order.created_at,
                    order.updated_at,
                ].join(","),
            ),
        ].join("\n")

        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.csv"`,
            },
        })
    } catch (error) {
        console.error("Export error:", error)
        return NextResponse.json({ success: false, message: "Terjadi kesalahan" }, { status: 500 })
    }
}
