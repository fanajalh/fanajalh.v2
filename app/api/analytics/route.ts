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
            return NextResponse.json({
                success: true,
                analytics: {
                    totalRevenue: 0, monthlyRevenue: 0, totalOrders: 0,
                    monthlyOrders: 0, averageOrderValue: 0, topServices: [], recentActivity: []
                }
            })
        }

        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total_price, 0)
        const totalOrders = orders.length

        const monthlyOrders = orders.filter((order: any) => {
            const orderDate = new Date(order.created_at)
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
        })

        const monthlyRevenue = monthlyOrders.reduce((sum: number, order: any) => sum + order.total_price, 0)
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        const serviceStats: { [key: string]: { count: number; revenue: number } } = {}
        orders.forEach((order: any) => {
            if (!serviceStats[order.service]) serviceStats[order.service] = { count: 0, revenue: 0 }
            serviceStats[order.service].count++
            serviceStats[order.service].revenue += order.total_price
        })

        const topServices = Object.entries(serviceStats)
            .map(([service, stats]) => ({ service, ...stats }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)

        const recentActivity = orders.slice(0, 10).map((order: any) => ({
            type: "order",
            message: `Pesanan baru dari ${order.name} - ${order.service}`,
            time: order.created_at,
        }))

        return NextResponse.json({
            success: true,
            analytics: { totalRevenue, monthlyRevenue, totalOrders, monthlyOrders: monthlyOrders.length, averageOrderValue, topServices, recentActivity }
        })
    } catch (error) {
        console.error("Analytics error:", error)
        return NextResponse.json({ success: false, message: "Gagal mengambil data analytics" }, { status: 500 })
    }
}
