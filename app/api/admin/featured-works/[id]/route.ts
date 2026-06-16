import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getDb();
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, client_name, badge, duration_text, is_active, sort_order } = await req.json();

    const result = await sql`
      UPDATE featured_works SET
        title = COALESCE(${title}, title),
        client_name = COALESCE(${client_name}, client_name),
        badge = COALESCE(${badge}, badge),
        duration_text = COALESCE(${duration_text}, duration_text),
        is_active = COALESCE(${is_active}, is_active),
        sort_order = COALESCE(${sort_order}, sort_order),
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getDb();
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await sql`DELETE FROM featured_works WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
