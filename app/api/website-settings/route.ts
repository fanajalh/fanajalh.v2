import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET — Ambil settings website
export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`SELECT settings FROM website_settings WHERE id = 1`;
    
    if (rows.length === 0) {
      // Return default jika belum ada row
      return NextResponse.json({ success: true, data: {
        orderPageOpen: true,
        premiumPageOpen: true,
        services: []
      }}, {
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
      });
    }

    return NextResponse.json({ success: true, data: rows[0].settings }, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
    });
  } catch (error: any) {
    console.error("GET website-settings error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT — Update settings website (admin only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as any).role === "admin";

    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const sql = getDb();
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ success: false, message: "Data tidak boleh kosong" }, { status: 400 });
    }

    // Cek apakah row sudah ada
    const existing = await sql`SELECT id FROM website_settings WHERE id = 1`;

    if (existing.length === 0) {
      await sql`INSERT INTO website_settings (id, settings, updated_at) VALUES (1, ${JSON.stringify(body)}, NOW())`;
    } else {
      await sql`UPDATE website_settings SET settings = ${JSON.stringify(body)}, updated_at = NOW() WHERE id = 1`;
    }

    return NextResponse.json({ success: true, message: "Pengaturan berhasil diperbarui." });
  } catch (error: any) {
    console.error("PUT website-settings error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
