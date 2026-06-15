import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { checkEcosystemLimit, logEcosystemUsage } from "@/lib/ecosystem-limit"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const limitCheck = await checkEcosystemLimit(request, "keyword");
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: limitCheck.message },
        { status: 403 }
      )
    }

    const { businessName, category, website, location } = await request.json()

    if (!businessName) {
      return NextResponse.json(
        { success: false, message: "Nama bisnis wajib diisi" },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { success: false, message: "GEMINI_API_KEY belum dikonfigurasi" },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `Kamu adalah SEO expert Indonesia yang berpengalaman.
Berikan 10 keyword suggestion untuk bisnis berikut:
- Nama Bisnis: ${businessName}
- Kategori: ${category || "Umum"}
- Website: ${website || "Tidak ada"}
- Lokasi: ${location || "Indonesia"}

Berikan keyword yang:
1. Relevan dengan bisnis
2. Punya search intent yang jelas (informational, commercial, transactional)
3. Mix antara short-tail dan long-tail
4. Fokus pasar Indonesia

PENTING: Output HANYA dalam format JSON array, tanpa markdown, tanpa penjelasan tambahan.
Format:
[{"keyword": "contoh keyword", "volume": 1000, "difficulty": "easy", "intent": "commercial"}]

Difficulty hanya boleh: "easy", "medium", "hard"
Intent hanya boleh: "informational", "commercial", "transactional", "navigational"
Volume adalah estimasi pencarian bulanan (angka integer).`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Parse JSON from response
    let keywords
    try {
      // Try to extract JSON from potential markdown code blocks
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      keywords = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText)
    } catch {
      return NextResponse.json(
        { success: false, message: "Gagal parsing response AI", raw: responseText },
        { status: 500 }
      )
    }

    // Log the ecosystem usage
    await logEcosystemUsage("keyword", 1, limitCheck.ip || null, limitCheck.email || null);

    return NextResponse.json({
      success: true,
      keywords,
      business: businessName,
    })
  } catch (error: any) {
    console.error("Keyword generate error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Gagal generate keyword" },
      { status: 500 }
    )
  }
}
