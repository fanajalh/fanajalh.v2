import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

// Max file size: 2MB in base64
const MAX_BASE64_LENGTH = 2 * 1024 * 1024 * 1.37; // ~2.74MB base64 string for 2MB file

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50)
    + "-" + Date.now().toString(36);
}

function isValidUrl(url: string): boolean {
  return /^https?:\/\/.+/i.test(url) || url.startsWith("/");
}

function isValidDataUrl(url: string): boolean {
  return /^data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,/.test(url);
}

export async function POST(req: Request) {
  try {
    // Check user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Anda harus login terlebih dahulu untuk mengupload frame." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const slots = Math.min(20, Math.max(1, Number(body.slots) || 4));

    // Determine image source
    let image_url = "";

    if (body.image_file) {
      // File upload as base64 data URL
      const dataUrl = String(body.image_file);
      if (!isValidDataUrl(dataUrl)) {
        return NextResponse.json(
          { success: false, message: "Format gambar tidak valid. Gunakan PNG, JPG, GIF, atau WebP." },
          { status: 400 }
        );
      }
      if (dataUrl.length > MAX_BASE64_LENGTH) {
        return NextResponse.json(
          { success: false, message: "Ukuran gambar terlalu besar. Maksimal 2MB." },
          { status: 400 }
        );
      }
      image_url = dataUrl;
    } else if (body.image_url) {
      // URL input
      const url = String(body.image_url).trim();
      if (!isValidUrl(url)) {
        return NextResponse.json(
          { success: false, message: "URL gambar harus diawali https:// atau /" },
          { status: 400 }
        );
      }
      image_url = url;
    }

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Nama frame wajib diisi." },
        { status: 400 }
      );
    }
    if (!image_url) {
      return NextResponse.json(
        { success: false, message: "Gambar wajib diisi (URL atau upload file)." },
        { status: 400 }
      );
    }

    const slug = generateSlug(name);
    const userId = (session.user as any).id ? parseInt((session.user as any).id, 10) : null;
    const uploaderName = session.user.name || session.user.email;

    const sql = getDb();

    // Auto-approve: is_active = true
    const result = await sql`
      INSERT INTO photobooth_frames (slug, name, description, image_url, slots, sort_order, is_active, uploaded_by, uploader_name)
      VALUES (${slug}, ${name}, ${description || null}, ${image_url}, ${slots}, ${1000}, ${true}, ${userId}, ${uploaderName})
      RETURNING id, slug, name
    `;

    return NextResponse.json({
      success: true,
      message: "Frame berhasil diupload! Frame langsung tampil di halaman.",
      data: result[0],
    });
  } catch (e: any) {
    console.error("POST /api/frames/upload:", e);
    if (e.code === "23505") {
      return NextResponse.json(
        { success: false, message: "Nama frame sudah dipakai, coba nama lain." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: e.message || "Terjadi kesalahan." },
      { status: 500 }
    );
  }
}

