import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getClientIp } from "@/lib/request-ip"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PREREQUISITES, logEcosystemUsage, checkEcosystemLimit } from "@/lib/ecosystem-limit"

export const dynamic = 'force-dynamic'

// GET - Returns the unlock status of all ecosystem features
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const sql = getDb()
    const ip = getClientIp(request) || "unknown"
    const userEmail = session?.user?.email
    const role = (session?.user as any)?.role || "guest"

    // If admin, everything is unlocked
    if (role === "admin") {
      return NextResponse.json({
        success: true,
        status: {
          lead_finder: true,
          crm: true,
          blast: true,
          keyword: true,
          seo: true,
          geo: true,
          site_audit: true,
          tracking: true
        }
      })
    }

    // Query all unique logged features for this session
    let logs = []
    if (userEmail) {
      logs = await sql`
        SELECT DISTINCT feature FROM ecosystem_usage_logs WHERE user_email = ${userEmail} AND usage_count > 0
      `
    } else {
      logs = await sql`
        SELECT DISTINCT feature FROM ecosystem_usage_logs WHERE ip_address = ${ip} AND usage_count > 0
      `
    }

    const completed = new Set(logs.map(l => l.feature))

    let status;
    if (role === "guest") {
      if (completed.size === 0) {
        // Guest hasn't chosen a feature yet, so all features are unlocked/selectable
        status = {
          lead_finder: true,
          crm: true,
          blast: true,
          keyword: true,
          seo: true,
          geo: true,
          site_audit: true,
          tracking: true
        }
      } else {
        // Guest has chosen a feature, so ONLY that feature is unlocked
        const chosenFeature = logs[0]?.feature || "lead_finder";
        status = {
          lead_finder: chosenFeature === "lead_finder",
          crm: chosenFeature === "crm",
          blast: chosenFeature === "blast",
          keyword: chosenFeature === "keyword",
          seo: chosenFeature === "seo",
          geo: chosenFeature === "geo",
          site_audit: chosenFeature === "site_audit",
          tracking: chosenFeature === "tracking"
        }
      }
    } else {
      // Logged-in free user has all features unlocked by default
      status = {
        lead_finder: true,
        crm: true,
        blast: true,
        keyword: true,
        seo: true,
        geo: true,
        site_audit: true,
        tracking: true
      }
    }

    return NextResponse.json({ success: true, status, role, hasChosen: completed.size > 0 })
  } catch (error: any) {
    console.error("Progression GET error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST - Logs a visit to a page (only if prerequisite is met)
export async function POST(request: NextRequest) {
  try {
    const { feature } = await request.json()
    if (!feature) {
      return NextResponse.json({ success: false, message: "Feature name required" }, { status: 400 })
    }

    // Check progression rules
    const limitCheck = await checkEcosystemLimit(request, feature, 0)
    if (!limitCheck.allowed) {
      return NextResponse.json({ success: false, message: limitCheck.message }, { status: 403 })
    }

    // Log the visit in the usage logs (usage count 0)
    await logEcosystemUsage(feature, 0, limitCheck.ip || null, limitCheck.email || null)

    return NextResponse.json({ success: true, message: `Successfully logged visit for ${feature}` })
  } catch (error: any) {
    console.error("Progression POST error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

