import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getDb } from "@/lib/db"
import { checkEcosystemLimit, logEcosystemUsage } from "@/lib/ecosystem-limit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getClientIp } from "@/lib/request-ip"
import { decryptId } from "@/lib/id-cipher"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const limitCheck = await checkEcosystemLimit(request, "seo");
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: limitCheck.message },
        { status: 403 }
      )
    }

    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const { businessName, product, keywords, contact_id } = await request.json()

    if (!businessName || !keywords || keywords.length === 0) {
      return NextResponse.json(
        { success: false, message: "Nama bisnis dan keyword wajib diisi" },
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

    const keywordList = Array.isArray(keywords) ? keywords.join(", ") : keywords

    const prompt = `Kamu adalah SEO content writer expert Indonesia yang berpengalaman.
Untuk bisnis "${businessName}" dengan produk/layanan "${product || businessName}" 
dan keyword target: ${keywordList}

Generate konten SEO dalam Bahasa Indonesia:

1. META TITLE (max 60 karakter, include keyword utama, menarik untuk diklik)
2. META DESCRIPTION (max 160 karakter, persuasif, ada call-to-action)
3. ARTIKEL BLOG SEO-friendly:
   - Minimal 800 kata
   - Gunakan H2 dan H3 headers
   - Keyword density 1-2%
   - Include internal linking suggestions
   - Tone profesional tapi mudah dipahami
   - Format dalam HTML
4. FAQ SCHEMA (5 pertanyaan dan jawaban relevan, dalam format JSON-LD)

PENTING: Output dalam format JSON, tanpa markdown wrapper:
{
  "meta_title": "...",
  "meta_description": "...",
  "blog_article": "<h2>...</h2><p>...</p>...",
  "faq_schema": { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [...] }
}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    let seoContent
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      seoContent = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText)
    } catch {
      return NextResponse.json(
        { success: false, message: "Gagal parsing response AI", raw: responseText },
        { status: 500 }
      )
    }

    // Decrypt contact ID if provided
    const contactIdRaw = contact_id ? decryptId(contact_id) : null

    // Save to database
    const sql = getDb()
    const project = await sql`
      INSERT INTO seo_projects (contact_id, business_name, product, meta_title, meta_description, blog_article, faq_schema, status, user_email)
      VALUES (
        ${contactIdRaw},
        ${businessName},
        ${product || null},
        ${seoContent.meta_title || null},
        ${seoContent.meta_description || null},
        ${seoContent.blog_article || null},
        ${typeof seoContent.faq_schema === 'object' ? JSON.stringify(seoContent.faq_schema) : seoContent.faq_schema || null},
        'generated',
        ${currentUserEmail}
      )
      RETURNING *
    `

    // Log the ecosystem usage
    await logEcosystemUsage("seo", 1, limitCheck.ip || null, limitCheck.email || null);

    return NextResponse.json({
      success: true,
      seoContent,
      project: project[0],
    })
  } catch (error: any) {
    console.error("SEO generate error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Gagal generate konten SEO" },
      { status: 500 }
    )
  }
}

