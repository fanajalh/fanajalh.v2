import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const sql = getDb();
    const { name, email, category, message, type } = await req.json();

    if (!category || !message) {
      return NextResponse.json({ error: "Category dan Saran wajib diisi" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO suggestions (nama, user_email, category, saran, status, type, author)
      VALUES (${name || null}, ${email || null}, ${category}, ${message}, 'pending', ${type || 'general'}, ${name || null})
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: result[0] });
  } catch (e: any) {
    console.error("SERVER ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sql = getDb();
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await sql`SELECT * FROM suggestions WHERE type = 'general' ORDER BY created_at DESC`;
    return NextResponse.json({ data });
  } catch (e) {
    console.error("SERVER GET ERROR:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

