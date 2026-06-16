import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const sql = getDb();
    const data = await sql`SELECT * FROM featured_works ORDER BY sort_order ASC, created_at DESC`;
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

    const { title, client_name, badge, duration_text, is_active, sort_order } = await req.json();

    if (!title) return NextResponse.json({ error: "Title wajib diisi" }, { status: 400 });

    const result = await sql`
      INSERT INTO featured_works (title, client_name, badge, duration_text, is_active, sort_order)
      VALUES (
        ${title},
        ${client_name || null},
        ${badge || 'Top'},
        ${duration_text || 'Selesai dalam 2 hari'},
        ${is_active !== false},
        ${sort_order || 0}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: result[0] });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

