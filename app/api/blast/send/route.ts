import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import nodemailer from "nodemailer"
import { v4 as uuidv4 } from "uuid"
import { checkEcosystemLimit, logEcosystemUsage } from "@/lib/ecosystem-limit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getClientIp } from "@/lib/request-ip"
import { decryptId } from "@/lib/id-cipher"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserEmail = session?.user?.email || `guest:${getClientIp(request) || 'unknown'}`

    const sql = getDb()
    const { campaign_id, recipients } = await request.json()

    if (!campaign_id || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { success: false, message: "Campaign dan recipients wajib diisi" },
        { status: 400 }
      )
    }

    const limitCheck = await checkEcosystemLimit(request, "blast", recipients.length);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: limitCheck.message },
        { status: 403 }
      )
    }

    // 1. Get current user's SMTP settings
    const smtpSettings = await sql`
      SELECT * FROM user_smtp_settings WHERE user_email = ${currentUserEmail} LIMIT 1
    `

    if (smtpSettings.length === 0) {
      return NextResponse.json(
        { success: false, message: "SMTP belum dikonfigurasi. Silakan atur SMTP terlebih dahulu." },
        { status: 400 }
      )
    }

    const smtp = smtpSettings[0]

    // 2. Get current user's campaign
    const campaigns = await sql`
      SELECT * FROM email_campaigns 
      WHERE id = ${campaign_id} AND user_email = ${currentUserEmail}
    `
    if (campaigns.length === 0) {
      return NextResponse.json(
        { success: false, message: "Campaign tidak ditemukan" },
        { status: 404 }
      )
    }
    const campaign = campaigns[0]

    // 3. Create transporter with user's SMTP
    const transporter = nodemailer.createTransport({
      host: smtp.smtp_host,
      port: smtp.smtp_port,
      secure: smtp.smtp_port === 465,
      auth: {
        user: smtp.smtp_email,
        pass: smtp.smtp_password,
      },
    })

    // 4. Verify SMTP connection
    try {
      await transporter.verify()
    } catch (verifyError: any) {
      return NextResponse.json(
        { success: false, message: `Koneksi SMTP gagal: ${verifyError.message}. Periksa kembali email dan app password.` },
        { status: 400 }
      )
    }

    // 5. Send emails with tracking
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "https://allfanajalh.my.id"
    let sentCount = 0
    let failCount = 0

    // Update campaign status to sending
    await sql`
      UPDATE email_campaigns SET status = 'sending' 
      WHERE id = ${campaign_id} AND user_email = ${currentUserEmail}
    `

    for (const recipient of recipients) {
      const trackingId = uuidv4()
      const contactIdRaw = recipient.contact_id ? decryptId(recipient.contact_id) : null

      try {
        // Inject tracking pixel into template
        const trackingPixel = `<img src="${baseUrl}/api/blast/track/${trackingId}" width="1" height="1" style="display:none;" alt="" />`
        const htmlWithTracking = campaign.template_html + trackingPixel

        // Replace placeholders
        const personalizedHtml = htmlWithTracking
          .replace(/\{\{name\}\}/g, recipient.name || "")
          .replace(/\{\{email\}\}/g, recipient.email || "")
          .replace(/\{\{company\}\}/g, recipient.company || "")

        const personalizedSubject = campaign.subject
          .replace(/\{\{name\}\}/g, recipient.name || "")

        // Send email
        await transporter.sendMail({
          from: `"${smtp.display_name || smtp.smtp_email}" <${smtp.smtp_email}>`,
          to: recipient.email,
          subject: personalizedSubject,
          html: personalizedHtml,
        })

        // Save recipient record
        await sql`
          INSERT INTO email_recipients (campaign_id, contact_id, email, name, status, sent_at, tracking_id)
          VALUES (${campaign_id}, ${contactIdRaw}, ${recipient.email}, ${recipient.name || null}, 'sent', CURRENT_TIMESTAMP, ${trackingId})
        `

        // Update CRM contact status (scoped to owner for extra security)
        if (contactIdRaw) {
          await sql`
            UPDATE crm_contacts SET status = 'CONTACTED', updated_at = CURRENT_TIMESTAMP
            WHERE id = ${contactIdRaw} AND user_email = ${currentUserEmail} AND status = 'NEW'
          `
        }

        sentCount++

        // Rate limiting: 1 email per second to avoid spam flags
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (sendError: any) {
        console.error(`Failed to send to ${recipient.email}:`, sendError.message)
        failCount++

        await sql`
          INSERT INTO email_recipients (campaign_id, contact_id, email, name, status, tracking_id)
          VALUES (${campaign_id}, ${contactIdRaw}, ${recipient.email}, ${recipient.name || null}, 'bounced', ${trackingId})
        `
      }
    }

    // 6. Update campaign stats
    await sql`
      UPDATE email_campaigns SET
        status = 'sent',
        sent_count = ${sentCount},
        total_recipients = ${recipients.length},
        sent_at = CURRENT_TIMESTAMP
      WHERE id = ${campaign_id} AND user_email = ${currentUserEmail}
    `

    // 7. Log tracking event
    await sql`
      INSERT INTO tracking_events (event_type, reference_id, reference_type, metadata, user_email)
      VALUES ('blast_sent', ${campaign_id}, 'campaign', ${JSON.stringify({ sent: sentCount, failed: failCount })}::jsonb, ${currentUserEmail})
    `

    // 8. Log ecosystem usage
    await logEcosystemUsage("blast", sentCount, limitCheck.ip || null, limitCheck.email || null);

    return NextResponse.json({
      success: true,
      message: `Blast selesai! ${sentCount} terkirim, ${failCount} gagal.`,
      sent: sentCount,
      failed: failCount,
    })
  } catch (error: any) {
    console.error("Blast send error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengirim blast" },
      { status: 500 }
    )
  }
}
