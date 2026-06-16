import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getDb();
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await sql`DELETE FROM top_products WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error in DELETE /api/admin/top-products/${params.id}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
