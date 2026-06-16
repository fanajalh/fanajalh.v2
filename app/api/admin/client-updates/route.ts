import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const sql = getDb();
    const data = await sql`SELECT * FROM client_updates ORDER BY created_at DESC`;
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sql = getDb();
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { order_id, client_email, title, status_text, is_active } = await req.json();

    if (!client_email || !title) {
      return NextResponse.json({ error: "client_email dan title wajib diisi" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO client_updates (order_id, client_email, title, status_text, is_active)
      VALUES (
        ${order_id || null},
        ${client_email},
        ${title},
        ${status_text || 'Sedang Dikerjakan...'},
        ${is_active !== false}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: result[0] });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

