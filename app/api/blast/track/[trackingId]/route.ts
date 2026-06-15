import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export const dynamic = 'force-dynamic'

// 1x1 transparent GIF
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
)

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  try {
    const sql = getDb()
    const { trackingId } = params

    // Find the recipient by tracking ID
    const recipients = await sql`
      SELECT er.*, ec.id as campaign_id 
      FROM email_recipients er
      JOIN email_campaigns ec ON er.campaign_id = ec.id
      WHERE er.tracking_id = ${trackingId}
      LIMIT 1
    `

    if (recipients.length > 0) {
      const recipient = recipients[0]

      // Only update if not already opened
      if (recipient.status === 'sent') {
        await sql`
          UPDATE email_recipients 
          SET status = 'opened', opened_at = CURRENT_TIMESTAMP
          WHERE tracking_id = ${trackingId}
        `

        // Update campaign open count
        await sql`
          UPDATE email_campaigns 
          SET open_count = open_count + 1 
          WHERE id = ${recipient.campaign_id}
        `

        // Update CRM contact status
        if (recipient.contact_id) {
          await sql`
            UPDATE crm_contacts SET status = 'OPENED', updated_at = CURRENT_TIMESTAMP
            WHERE id = ${recipient.contact_id} AND status IN ('NEW', 'CONTACTED')
          `
        }

        // Log tracking event
        await sql`
          INSERT INTO tracking_events (event_type, reference_id, reference_type, metadata)
          VALUES ('email_open', ${recipient.id}, 'email_recipient', ${JSON.stringify({ campaign_id: recipient.campaign_id, email: recipient.email })}::jsonb)
        `
      }
    }
  } catch (error) {
    console.error("Tracking error:", error)
  }

  // Always return the transparent GIF regardless of errors
  return new Response(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  })
}
