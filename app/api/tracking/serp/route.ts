import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { checkEcosystemLimit, logEcosystemUsage } from "@/lib/ecosystem-limit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getClientIp } from "@/lib/request-ip"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const limitCheck = await checkEcosystemLimit(request, "serp");
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: limitCheck.message },
        { status: 403 }
      )
    }

    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const { keyword } = await request.json()

    if (!keyword) {
      return NextResponse.json(
        { success: false, message: "Keyword wajib diisi" },
        { status: 400 }
      )
    }

    const apiKey = process.env.SERPER_API_KEY
    if (!apiKey || apiKey === "your_serper_api_key_here") {
      return NextResponse.json(
        { success: false, message: "SERPER_API_KEY belum dikonfigurasi" },
        { status: 500 }
      )
    }

    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: keyword,
        gl: "id",
        hl: "id",
        num: 100,
      }),
    })

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status}`)
    }

    const data = await response.json()
    const organicResults = data.organic || []

    // Find position of the target
    let position = null
    for (let i = 0; i < organicResults.length; i++) {
      position = i + 1
      // We just return the position for the user to check
    }

    // Update keyword position in DB (only for keywords owned by current user)
    const sql = getDb()
    const existingKeyword = await sql`
      SELECT id, current_position FROM keywords 
      WHERE keyword = ${keyword} AND user_email = ${currentUserEmail} 
      LIMIT 1
    `

    if (existingKeyword.length > 0) {
      await sql`
        UPDATE keywords SET 
          previous_position = current_position,
          current_position = ${position},
          last_checked = CURRENT_TIMESTAMP
        WHERE id = ${existingKeyword[0].id} AND user_email = ${currentUserEmail}
      `
    }

    // Log the ecosystem usage
    await logEcosystemUsage("serp", 1, limitCheck.ip || null, limitCheck.email || null);

    return NextResponse.json({
      success: true,
      keyword,
      results: organicResults.slice(0, 20).map((r: any, i: number) => ({
        position: i + 1,
        title: r.title,
        link: r.link,
        snippet: r.snippet,
      })),
      totalResults: data.searchParameters?.totalResults || organicResults.length,
    })
  } catch (error: any) {
    console.error("SERP tracking error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Gagal cek posisi SERP" },
      { status: 500 }
    )
  }
}
