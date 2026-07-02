import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export const dynamic = "force-dynamic"

// Auto-create table
async function ensureTable() {
  const sql = getDb()
  await sql`
    CREATE TABLE IF NOT EXISTS apk_settings (
      id SERIAL PRIMARY KEY,
      version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
      file_url TEXT NOT NULL DEFAULT '/AllFanajalh.apk',
      file_size VARCHAR(50) NOT NULL DEFAULT '~25 MB',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
}

// GET: Ambil APK settings terbaru (public, tidak perlu login)
export async function GET() {
  try {
    await ensureTable()
    const sql = getDb()
    const rows = await sql`
      SELECT * FROM apk_settings ORDER BY created_at DESC LIMIT 1
    `
    if (rows.length > 0) {
      return NextResponse.json({ success: true, data: rows[0] })
    }
    // Return null if no APK settings exist
    return NextResponse.json({
      success: true,
      data: null,
    })
  } catch (error: any) {
    console.error("GET apk-settings error:", error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

// POST: Upload file APK + simpan metadata (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    await ensureTable()

    const formData = await request.formData()
    const version = formData.get("version") as string
    const file = formData.get("file") as File | null

    if (!version) {
      return NextResponse.json(
        { success: false, message: "Version wajib diisi" },
        { status: 400 }
      )
    }

    let fileUrl = "/AllFanajalh.apk"
    let fileSize = "~25 MB"

    if (file && file.size > 0) {
      // Simpan file ke folder public
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const publicDir = path.join(process.cwd(), "public")
      await mkdir(publicDir, { recursive: true })

      const fileName = "AllFanajalh.apk"
      const filePath = path.join(publicDir, fileName)
      await writeFile(filePath, buffer)

      fileUrl = `/${fileName}`

      // Hitung ukuran file
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
      fileSize = `~${sizeMB} MB`
    } else {
      // Jika tidak upload file baru, ambil fileSize dari form
      const manualSize = formData.get("file_size") as string
      if (manualSize) fileSize = manualSize
    }

    const sql = getDb()
    await sql`
      INSERT INTO apk_settings (version, file_url, file_size)
      VALUES (${version}, ${fileUrl}, ${fileSize})
    `

    return NextResponse.json({
      success: true,
      message: `APK v${version} berhasil disimpan!`,
      data: { version, file_url: fileUrl, file_size: fileSize },
    })
  } catch (error: any) {
    console.error("POST apk-settings error:", error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
