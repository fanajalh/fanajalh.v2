import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getClientIp } from "@/lib/request-ip"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()

    // Aggregate stats from crm_contacts for current user
    const [contactStats] = await sql`
      SELECT 
        COUNT(*) as total_contacts,
        COUNT(*) FILTER (WHERE source = 'lead_finder') as leads_found,
        COUNT(*) FILTER (WHERE status = 'NEW') as status_new,
        COUNT(*) FILTER (WHERE status = 'CONTACTED') as status_contacted,
        COUNT(*) FILTER (WHERE status = 'OPENED') as status_opened,
        COUNT(*) FILTER (WHERE status = 'REPLIED') as status_replied,
        COUNT(*) FILTER (WHERE status = 'DEAL') as status_deal
      FROM crm_contacts
      WHERE user_email = ${currentUserEmail}
    `

    // Aggregate email stats for current user
    const [emailStats] = await sql`
      SELECT 
        COALESCE(SUM(total_recipients), 0) as total_recipients,
        COALESCE(SUM(sent_count), 0) as emails_sent,
        COALESCE(SUM(open_count), 0) as emails_opened,
        COALESCE(SUM(reply_count), 0) as emails_replied,
        COUNT(*) as total_campaigns
      FROM email_campaigns
      WHERE status = 'sent' AND user_email = ${currentUserEmail}
    `

    // Aggregate SEO stats for current user
    const [seoStats] = await sql`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(*) FILTER (WHERE status = 'generated') as generated,
        COUNT(*) FILTER (WHERE status = 'published') as published
      FROM seo_projects
      WHERE user_email = ${currentUserEmail}
    `

    // Aggregate keyword stats for current user
    const [keywordStats] = await sql`
      SELECT 
        COUNT(*) as total_keywords,
        AVG(current_position) as avg_position
      FROM keywords
      WHERE user_email = ${currentUserEmail}
    `

    // Recent events for current user
    const recentEvents = await sql`
      SELECT * FROM tracking_events 
      WHERE user_email = ${currentUserEmail}
      ORDER BY created_at DESC LIMIT 20
    `

    // Campaign performance for current user
    const campaigns = await sql`
      SELECT id, name, subject, total_recipients, sent_count, open_count, reply_count, sent_at
      FROM email_campaigns
      WHERE status = 'sent' AND user_email = ${currentUserEmail}
      ORDER BY sent_at DESC LIMIT 10
    `

    // Keywords list for current user
    const keywordsList = await sql`
      SELECT kw.*, cc.name as contact_name
      FROM keywords kw
      LEFT JOIN crm_contacts cc ON kw.contact_id = cc.id
      WHERE kw.user_email = ${currentUserEmail}
      ORDER BY kw.created_at DESC
    `

    // Funnel data
    const funnel = {
      leads_found: parseInt(contactStats.leads_found || "0"),
      crm_total: parseInt(contactStats.total_contacts || "0"),
      blast_sent: parseInt(emailStats.emails_sent || "0"),
      email_opened: parseInt(emailStats.emails_opened || "0"),
      email_replied: parseInt(emailStats.emails_replied || "0"),
      deals: parseInt(contactStats.status_deal || "0"),
    }

    // Calculate rates
    const openRate = funnel.blast_sent > 0 
      ? ((funnel.email_opened / funnel.blast_sent) * 100).toFixed(1)
      : "0"
    const replyRate = funnel.email_opened > 0
      ? ((funnel.email_replied / funnel.email_opened) * 100).toFixed(1)
      : "0"
    const conversionRate = funnel.crm_total > 0
      ? ((funnel.deals / funnel.crm_total) * 100).toFixed(1)
      : "0"

    return NextResponse.json({
      success: true,
      stats: {
        contacts: contactStats,
        emails: emailStats,
        seo: seoStats,
        keywords: keywordStats,
        funnel,
        rates: { openRate, replyRate, conversionRate },
      },
      campaigns,
      recentEvents,
      keywordsList,
    })
  } catch (error: any) {
    console.error("Tracking stats error:", error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
