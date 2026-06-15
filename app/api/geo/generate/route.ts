import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { checkEcosystemLimit, logEcosystemUsage } from "@/lib/ecosystem-limit"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const limitCheck = await checkEcosystemLimit(request, "geo")
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: limitCheck.message },
        { status: 403 }
      )
    }

    const { businessName, category, website, founder, location, keywords } = await request.json()

    if (!businessName || !website) {
      return NextResponse.json(
        { success: false, message: "Nama bisnis/brand dan URL website wajib diisi" },
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

    const keywordList = Array.isArray(keywords) ? keywords.join(", ") : (keywords || "-")

    const prompt = `Kamu adalah pakar GEO (Generative Engine Optimization) dan AIO (AI Search Optimization) ternama.
Untuk bisnis/brand berikut:
- Nama Brand: "${businessName}"
- Kategori/Niche: "${category || "-"}"
- URL Website: "${website}"
- Pendiri (Founder): "${founder || "-"}"
- Lokasi Bisnis: "${location || "-"}"
- Layanan/Kata Kunci Utama: "${keywordList}"

Buatkan rekomendasi optimasi AI Google (Gemini Search / SGE) agar brand ini mudah dikenali, dirangkum, dan direkomendasikan saat orang mencari nama brand atau niche-nya di Google.

Generate output dalam format JSON Bahasa Indonesia dengan struktur persis seperti berikut tanpa markdown wrapper:
{
  "simulated_summary": "Tulis simulasi ringkasan AI Google Search/Gemini saat orang mencari '${businessName}'. Cth: 'Berdasarkan informasi web, ${businessName} adalah perusahaan ... yang didirikan oleh ... berbasis di ... Platform ini menawarkan ...'",
  "organization_schema": {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "${businessName}",
    "url": "${website}",
    "logo": "${website}/logo.png",
    "founder": {
      "@type": "Person",
      "name": "${founder || "Founder"}"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "${location || "Indonesia"}"
    }
  },
  "faq_schema": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Apa itu ${businessName}?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Jawaban terstruktur tentang apa itu ${businessName} dan layanannya..."
        }
      },
      {
        "@type": "Question",
        "name": "Siapa pendiri ${businessName}?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "${businessName} didirikan oleh ${founder || "tim profesional"}..."
        }
      },
      {
        "@type": "Question",
        "name": "Layanan apa saja yang ditawarkan ${businessName}?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Detail layanan mencakup ${keywordList}..."
        }
      }
    ]
  },
  "audit_checklist": [
    {
      "task": "Struktur Semantic HTML & Heading",
      "status": "pending",
      "action": "Pastikan tag H1 berisi nama brand '${businessName}' secara jelas, dan H2 berisi layanan utama Anda. Hindari menyembunyikan teks penting dalam gambar agar web crawler AI bisa merayapinya."
    },
    {
      "task": "Pendaftaran Entitas & Sitasi Digital",
      "status": "pending",
      "action": "Daftarkan profil bisnis di Google Business Profile, LinkedIn Company, Crunchbase, dan direktori bisnis lokal dengan nama yang konsisten: '${businessName}'."
    },
    {
      "task": "Topical Authority & FAQ Brand",
      "status": "pending",
      "action": "Tulis satu halaman khusus 'Tentang Kami' atau 'Hubungi Kami' yang menyebutkan secara eksplisit bahwa '${businessName}' didirikan oleh '${founder || "kami"}' di '${location || "Indonesia"}' guna mempermudah AI merangkum profil perusahaan."
    },
    {
      "task": "Koneksi Google Search Console",
      "status": "pending",
      "action": "Kirimkan sitemap.xml Anda ke Google Search Console agar halaman situs cepat diindeks oleh bot pencari Google & AI."
    }
  ],
  "brand_strategy": "Tulis rangkuman strategi GEO menyeluruh yang berfokus pada keyword '${keywordList}' agar saat ada query informasional tentang niche tersebut, AI Google mereferensikan '${businessName}' sebagai salah satu sumber terpercaya."
}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    let geoContent
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      geoContent = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText)
    } catch {
      return NextResponse.json(
        { success: false, message: "Gagal parsing response AI", raw: responseText },
        { status: 500 }
      )
    }

    // Log the ecosystem usage under "geo"
    await logEcosystemUsage("geo", 1, limitCheck.ip || null, limitCheck.email || null)

    return NextResponse.json({
      success: true,
      geoContent
    })
  } catch (error: any) {
    console.error("GEO generate error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Gagal generate rekomendasi GEO" },
      { status: 500 }
    )
  }
}
