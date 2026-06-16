import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const sql = getDb();
        const data = await request.json()
        
        const newName = data.name?.trim()
        const newPassword = data.password?.trim()

        if (!newName && !newPassword) {
           return NextResponse.json({ success: false, message: "Tidak ada data yang dirubah." }, { status: 400 })
        }

        if (newName && newPassword) {
             const hashedPassword = await bcrypt.hash(newPassword, 10)
             await sql`UPDATE users SET name = ${newName}, password = ${hashedPassword} WHERE email = ${session.user.email}`;
        } else if (newName) {
             await sql`UPDATE users SET name = ${newName} WHERE email = ${session.user.email}`;
        } else if (newPassword) {
             const hashedPassword = await bcrypt.hash(newPassword, 10)
             await sql`UPDATE users SET password = ${hashedPassword} WHERE email = ${session.user.email}`;
        }

        return NextResponse.json({ success: true, message: "Profil berhasil diperbarui. Jika sandi dirubah, harap login ulang jika diperlukan." })
    } catch (error) {
        console.error("User settings update error:", error)
        return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 })
    }
}

