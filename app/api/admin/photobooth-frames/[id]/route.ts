import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { validateFrameImageUrl, validateFrameSlug } from "@/lib/photobooth-validation";

type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const sql = getDb();

    const patch: Record<string, unknown> = {};

    if (body.slug !== undefined) {
      const slug = String(body.slug).trim().toLowerCase();
      if (!validateFrameSlug(slug)) {
        return NextResponse.json({ success: false, message: "Slug tidak valid." }, { status: 400 });
      }
      patch.slug = slug;
    }
    if (body.name !== undefined) patch.name = String(body.name).trim();
    if (body.description !== undefined) patch.description = String(body.description).trim();
    if (body.image_url !== undefined) {
      const u = String(body.image_url).trim();
      if (!validateFrameImageUrl(u)) {
        return NextResponse.json({ success: false, message: "URL gambar tidak valid." }, { status: 400 });
      }
      patch.image_url = u;
    }
    if (body.slots !== undefined) {
      patch.slots = Math.min(20, Math.max(1, Number(body.slots) || 4));
    }
    if (body.sort_order !== undefined) patch.sort_order = Number(body.sort_order) || 0;
    if (body.is_active !== undefined) patch.is_active = Boolean(body.is_active);

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ success: false, message: "Tidak ada perubahan." }, { status: 400 });
    }

    const row = await sql`
      UPDATE photobooth_frames SET
        slug = COALESCE(${patch.slug ?? null}, slug),
        name = COALESCE(${patch.name ?? null}, name),
        description = COALESCE(${patch.description ?? null}, description),
        image_url = COALESCE(${patch.image_url ?? null}, image_url),
        slots = COALESCE(${patch.slots ?? null}, slots),
        sort_order = COALESCE(${patch.sort_order ?? null}, sort_order),
        is_active = COALESCE(${patch.is_active ?? null}, is_active),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, slug, name, description, image_url, slots, sort_order, is_active
    `;

    if (row.length === 0) {
      return NextResponse.json({ success: false, message: "Tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: row[0] });
  } catch (e: any) {
    if (e.code === "23505") {
      return NextResponse.json({ success: false, message: "Slug sudah dipakai." }, { status: 409 });
    }
    console.error("PATCH photobooth-frames:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
    }

    const sql = getDb();
    const del = await sql`DELETE FROM photobooth_frames WHERE id = ${id} RETURNING id`;
    if (del.length === 0) {
      return NextResponse.json({ success: false, message: "Tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("DELETE photobooth-frames:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
