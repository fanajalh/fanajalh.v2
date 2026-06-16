import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const sql = getDb();
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { response, status } = await req.json();
        if (!response) {
            return NextResponse.json({ error: "Response wajib diisi" }, { status: 400 });
        }

        const result = await sql`
            UPDATE suggestions SET response = ${response}, status = ${status || 'reviewed'}, updated_at = NOW()
            WHERE id = ${parseInt(params.id)}
            RETURNING *
        `;

        if (result.length === 0) {
            return NextResponse.json({ error: "Saran tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const sql = getDb();
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const result = await sql`DELETE FROM suggestions WHERE id = ${parseInt(params.id)} RETURNING id`;
        if (result.length === 0) {
            return NextResponse.json({ error: "Saran tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}