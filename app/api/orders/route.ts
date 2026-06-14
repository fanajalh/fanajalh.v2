import { type NextRequest, NextResponse } from "next/server"
import nodemailer from 'nodemailer'
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const dynamic = 'force-dynamic'

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

async function sendEmail(mailOptions: nodemailer.SendMailOptions) {
    if (!process.env.EMAIL_USER) return { success: false, message: "Email credentials missing" };
    try {
        const info = await transporter.sendMail(mailOptions);
        return { success: true, message: `Email sent: ${info.messageId}` };
    } catch (error) {
        console.error("Nodemailer failed:", error);
        return { success: false, message: "Nodemailer error" };
    }
}

export async function POST(request: NextRequest) {
    try {
        const sql = getDb();
        const orderData = await request.json()
        const orderNumber = `JP${Date.now()}`

        const servicePrices: { [key: string]: number } = {
            "poster-event": 15000, "poster-edukasi": 20000, "social-media": 25000,
            "print-flyer": 15000, "lainya": 10000,
        }
        const packageIncrement: { [key: string]: number } = {
            basic: 0, professional: 5000, enterprise: 20000,
        }

        const basePrice = servicePrices[orderData.service] || 0
        const packageAddon = packageIncrement[orderData.package] || 0
        const totalPrice = basePrice + packageAddon

        const result = await sql`
            INSERT INTO orders (order_number, name, email, phone, company, service, package, title, description, dimensions, colors, deadline, additional_info, total_price, status)
            VALUES (${orderNumber}, ${orderData.contact.name}, ${orderData.contact.email}, ${orderData.contact.phone}, ${orderData.contact.company || null}, ${orderData.service}, ${orderData.package}, ${orderData.details.title || null}, ${orderData.details.description || null}, ${orderData.details.dimensions || null}, ${orderData.details.colors || null}, ${orderData.details.deadline || null}, ${orderData.details.additionalInfo || null}, ${totalPrice}, 'pending')
            RETURNING *
        `;

        const order = result[0];

        // Notifications
        try {
            if (process.env.EMAIL_USER) {
                const htmlContent = `
<div style="font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7; padding: 20px;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <div style="background-color: #ff5722; color: #ffffff; padding: 25px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 26px;">💰 PESANAN ANDA MASUK!</h1>
            <p style="margin: 5px 0 0; font-size: 14px;">Order ID: ${orderNumber}</p>
        </div>
        <div style="padding: 30px;"><p>Pesanan dengan ID: ${orderNumber} berhasil dibuat.</p></div>
    </div>
</div>`;
                await sendEmail({
                    from: `"JokiPoster System" <${process.env.EMAIL_USER}>`,
                    to: orderData.contact.email,
                    bcc: process.env.EMAIL_USER,
                    subject: `[JokiPoster] Pesanan Anda Berhasil Dibuat (${orderNumber})`,
                    html: htmlContent,
                });
            }

            if (process.env.ULTRAMSG_INSTANCE_ID && process.env.ULTRAMSG_TOKEN) {
                fetch(`https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE_ID}/messages/chat`, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        token: process.env.ULTRAMSG_TOKEN!,
                        to: "6285728150223",
                        body: `🎉 *PESANAN BARU MASUK!*\n\nOrder ID: ${orderNumber}`,
                    }),
                })
            }
        } catch (notificationError) {
            console.error("Notification error:", notificationError)
        }

        return NextResponse.json({ success: true, message: "Pesanan berhasil dikirim!", order })
    } catch (error: any) {
        console.error("Order submission error:", error)
        return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 })
    }
}

    export async function GET(request: NextRequest) {
        try {
            const sql = getDb();
            const session = await getServerSession(authOptions)
            if (!session) {
                return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
            }
    
            if ((session.user as any).role === "admin") {
                const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
                return NextResponse.json({ success: true, orders })
            } else {
                const orders = await sql`SELECT * FROM orders WHERE email = ${session.user?.email} ORDER BY created_at DESC`;
                return NextResponse.json({ success: true, orders })
            }
    } catch (error) {
        console.error("Orders GET error:", error)
        return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 })
    }
}