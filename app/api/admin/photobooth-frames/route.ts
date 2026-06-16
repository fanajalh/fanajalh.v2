import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { validateFrameImageUrl, validateFrameSlug } from "@/lib/photobooth-validation";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const sql = getDb();
    const rows = await sql`
      SELECT id, slug, name, description, image_url, slots, sort_order, is_active, created_at, updated_at, uploaded_by, uploader_name
      FROM photobooth_frames
      ORDER BY sort_order ASC, id ASC
    `;
    return NextResponse.json({ success: true, data: rows });
  } catch (e: any) {
    console.error("admin photobooth-frames GET:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const image_url = typeof body.image_url === "string" ? body.image_url.trim() : "";
    const slots = Number(body.slots) || 4;
    const sort_order = Number(body.sort_order) || 0;
    const is_active = body.is_active !== false;

    if (!validateFrameSlug(slug)) {
      return NextResponse.json(
        { success: false, message: "Slug tidak valid (huruf kecil, angka, tanda hubung)." },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json({ success: false, message: "Nama wajib diisi." }, { status: 400 });
    }
    if (!validateFrameImageUrl(image_url)) {
      return NextResponse.json(
        { success: false, message: "URL gambar harus https atau path /..." },
        { status: 400 }
      );
    }

    const sql = getDb();
    const result = await sql`
      INSERT INTO photobooth_frames (slug, name, description, image_url, slots, sort_order, is_active)
      VALUES (${slug}, ${name}, ${description || null}, ${image_url}, ${Math.min(20, Math.max(1, slots))}, ${sort_order}, ${is_active})
      RETURNING id, slug, name, description, image_url, slots, sort_order, is_active
    `;
    return NextResponse.json({ success: true, data: result[0] });
  } catch (e: any) {
    if (e.code === "23505") {
      return NextResponse.json({ success: false, message: "Slug sudah dipakai." }, { status: 409 });
    }
    console.error("admin photobooth-frames POST:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

