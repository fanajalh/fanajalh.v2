import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { checkEcosystemLimit, logEcosystemUsage } from "@/lib/ecosystem-limit"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const limitCheck = await checkEcosystemLimit(request, "site_audit")
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: limitCheck.message },
        { status: 403 }
      )
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { success: false, message: "URL website wajib diisi" },
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

    // 1. Fetch the website HTML
    let htmlContent = ""
    let fetchError = ""
    try {
      const normalizedUrl = url.startsWith("http") ? url : `https://${url}`
      const pageRes = await fetch(normalizedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; SiteAuditBot/1.0; +https://fanajah.com)",
          "Accept": "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(15000),
      })
      if (pageRes.ok) {
        const fullHtml = await pageRes.text()
        // Trim to ~12000 chars to stay within AI token limits
        htmlContent = fullHtml.substring(0, 12000)
      } else {
        fetchError = `HTTP ${pageRes.status}`
      }
    } catch (err: any) {
      fetchError = err.message || "Gagal mengakses website"
    }

    if (!htmlContent && fetchError) {
      return NextResponse.json(
        { success: false, message: `Tidak bisa mengakses website: ${fetchError}. Pastikan URL benar dan website online.` },
        { status: 400 }
      )
    }

    // 2. Use Gemini AI to analyze the HTML
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `Kamu adalah pakar audit SEO, GEO (Generative Engine Optimization), dan analisis website ternama di Indonesia.

Berikut adalah potongan kode HTML dari website "${url}":
\`\`\`html
${htmlContent}
\`\`\`

Lakukan audit menyeluruh terhadap website tersebut dan berikan penilaian dalam format JSON Bahasa Indonesia, tanpa markdown wrapper.

Struktur JSON output yang HARUS diikuti:
{
  "overall_score": 75,
  "grade": "B+",
  "site_title": "Judul website yang terdeteksi dari tag <title>",
  "meta_description": "Meta description yang terdeteksi, atau 'Tidak ditemukan'",
  
  "scores": {
    "seo_onpage": {
      "score": 70,
      "max": 100,
      "label": "SEO On-Page",
      "details": [
        "✅ Hal yang sudah baik...",
        "❌ Hal yang perlu diperbaiki..."
      ]
    },
    "geo_readiness": {
      "score": 40,
      "max": 100,
      "label": "GEO / AI-Readiness",
      "details": [
        "✅ atau ❌ detail..."
      ]
    },
    "content_quality": {
      "score": 65,
      "max": 100,
      "label": "Kualitas Konten",
      "details": [
        "✅ atau ❌ detail..."
      ]
    },
    "technical_seo": {
      "score": 55,
      "max": 100,
      "label": "SEO Teknis",
      "details": [
        "✅ atau ❌ detail..."
      ]
    },
    "mobile_ux": {
      "score": 80,
      "max": 100,
      "label": "Mobile & UX",
      "details": [
        "✅ atau ❌ detail..."
      ]
    }
  },
  
  "detected_keywords": [
    { "keyword": "kata kunci terdeteksi 1", "density": "1.2%", "potential": "tinggi" },
    { "keyword": "kata kunci terdeteksi 2", "density": "0.8%", "potential": "sedang" },
    { "keyword": "kata kunci terdeteksi 3", "density": "0.5%", "potential": "rendah" }
  ],
  
  "schema_detected": ["Organization", "FAQPage"] atau [],
  
  "critical_issues": [
    "Masalah kritis 1 yang harus segera diperbaiki...",
    "Masalah kritis 2..."
  ],
  
  "recommendations": [
    {
      "priority": "high",
      "category": "SEO",
      "title": "Judul rekomendasi",
      "description": "Deskripsi detail apa yang harus dilakukan..."
    },
    {
      "priority": "medium",
      "category": "GEO",
      "title": "Judul rekomendasi",
      "description": "Deskripsi detail..."
    }
  ],
  
  "summary": "Ringkasan singkat 2-3 kalimat tentang kondisi keseluruhan website ini dan potensi untuk ranking di Google serta terbaca oleh AI Google."
}

PENTING:
- overall_score adalah rata-rata dari 5 sub-skor (0-100)
- grade mengikuti skala: A+ (90-100), A (80-89), B+ (70-79), B (60-69), C+ (50-59), C (40-49), D (30-39), F (0-29)
- Berikan minimal 3 detected_keywords yang relevan dari konten website
- Berikan minimal 3 recommendations yang actionable
- Analisis apakah ada Schema Markup (JSON-LD) di dalam HTML
- Periksa apakah ada meta viewport untuk mobile-friendliness
- Periksa heading structure (H1, H2, H3)
- Periksa apakah ada FAQ/About/Contact page indicators
- Semua teks output dalam Bahasa Indonesia`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    let auditResult
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      auditResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText)
    } catch {
      return NextResponse.json(
        { success: false, message: "Gagal parsing response AI audit", raw: responseText },
        { status: 500 }
      )
    }

    // Log the ecosystem usage
    await logEcosystemUsage("site_audit", 1, limitCheck.ip || null, limitCheck.email || null)

    return NextResponse.json({
      success: true,
      audit: auditResult,
      url
    })
  } catch (error: any) {
    console.error("Site audit error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Gagal melakukan audit website" },
      { status: 500 }
    )
  }
}
