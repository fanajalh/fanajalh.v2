import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { checkEcosystemLimit, logEcosystemUsage } from "@/lib/ecosystem-limit"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const limitCheck = await checkEcosystemLimit(request, "lead_finder");
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: limitCheck.message },
        { status: 403 }
      )
    }

    const { category, location } = await request.json()

    if (!category || !location) {
      return NextResponse.json(
        { success: false, message: "Kategori dan lokasi wajib diisi" },
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

    const response = await fetch("https://google.serper.dev/places", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: `${category} di ${location}`,
        gl: "id",
        hl: "id",
      }),
    })

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status}`)
    }

    const data = await response.json()
    const places = (data.places || []).map((place: any) => ({
      title: place.title || "",
      address: place.address || "",
      phone: place.phoneNumber || "",
      website: place.website || "",
      rating: place.rating || 0,
      reviews: place.ratingCount || 0,
      category: category,
      cid: place.cid || "",
    }))

    // Log the ecosystem usage
    await logEcosystemUsage("lead_finder", 1, limitCheck.ip || null, limitCheck.email || null);

    return NextResponse.json({
      success: true,
      leads: places,
      total: places.length,
      query: `${category} di ${location}`,
    })
  } catch (error: any) {
    console.error("Lead search error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mencari lead" },
      { status: 500 }
    )
  }
}
