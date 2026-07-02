import { type NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sendSuggestionEmail } from "@/lib/email-util";

export const dynamic = "force-dynamic";

const DEFAULT_TEMPLATE_LINKS: { [key: string]: string } = {
  basic: "https://drive.google.com/drive/folders/1TOCP9uJpX_5g_tXgV-basic-placeholder",
  professional: "https://drive.google.com/drive/folders/1TOCP9uJpX_5g_tXgV-pro-placeholder",
  enterprise: "https://drive.google.com/drive/folders/1TOCP9uJpX_5g_tXgV-enterprise-placeholder",
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as any).role === "admin";

    // ONLY admin is allowed to manually trigger confirmation via this API
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Hanya admin yang dapat menyetujui transaksi." },
        { status: 401 }
      );
    }

    const { orderNumber } = await request.json();

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: "Nomor transaksi wajib disertakan." },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Find and update the order in a single query
    const result = await sql`
      UPDATE orders
      SET status = 'completed', updated_at = NOW()
      WHERE order_number = ${orderNumber} AND status != 'completed'
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Transaksi tidak ditemukan atau sudah selesai." },
        { status: 404 }
      );
    }

    const order = result[0];
    const packageKey = order.package.toLowerCase();
    
    // Resolve download link dynamically from database
    let driveLink = "";

    // 1. Try resolving package from website_settings
    if (["basic", "professional", "enterprise"].includes(packageKey)) {
      try {
        const settingsRows = await sql`SELECT settings FROM website_settings WHERE id = 1`;
        if (settingsRows.length > 0 && settingsRows[0].settings?.services) {
          const service = settingsRows[0].settings.services.find((s: any) => s.id === packageKey);
          if (service && service.driveLink) {
            driveLink = service.driveLink;
          }
        }
      } catch (err) {
        console.error("Error fetching package settings:", err);
      }
    }

    // 2. If it is custom_template or custom catalog design
    if (!driveLink && order.title) {
      try {
        // Try products table first
        const dbProduct = await sql`SELECT drive_link FROM products WHERE title = ${order.title} LIMIT 1`;
        if (dbProduct.length > 0 && dbProduct[0].drive_link) {
          driveLink = dbProduct[0].drive_link;
        } else {
          // Try portfolio_designs table
          const dbPortfolio = await sql`SELECT drive_link FROM portfolio_designs WHERE title = ${order.title} LIMIT 1`;
          if (dbPortfolio.length > 0 && dbPortfolio[0].drive_link) {
            driveLink = dbPortfolio[0].drive_link;
          }
        }
      } catch (err) {
        console.error("Error fetching product drive link:", err);
      }
    }

    // 3. Fallback to defaults
    if (!driveLink) {
      driveLink = DEFAULT_TEMPLATE_LINKS[packageKey] || DEFAULT_TEMPLATE_LINKS.basic;
    }

    // Format package display name
    const packageNames: { [key: string]: string } = {
      basic: "Basic Pack",
      professional: "Professional Pack",
      enterprise: "Enterprise All-in-One Bundle",
    };
    const displayPackageName = packageNames[packageKey] || order.title || order.package;

    // Send email using Nodemailer
    const adminEmail = process.env.EMAIL_USER;
    if (adminEmail) {
      const emailContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; margin: 20px auto; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
          <div style="text-align: center; border-bottom: 2px solid #ff7a00; padding-bottom: 20px; margin-bottom: 25px;">
            <h2 style="color: #ea580c; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">FANAJAH TEMPLATE SHOP</h2>
            <p style="color: #64748b; font-size: 14px; margin: 5px 0 0; font-weight: 600; text-transform: uppercase;">Pembelian Dikonfirmasi</p>
          </div>
          <div style="color: #334155; line-height: 1.7; font-size: 15px;">
            <p>Halo <strong>${order.name}</strong>,</p>
            <p>Terima kasih telah berbelanja di Fanajah. Pembayaran Anda untuk pembelian <strong>Template Desain - ${displayPackageName}</strong> telah kami verifikasi.</p>
            <p>Berikut adalah tautan Google Drive / Canva untuk mengakses dan mengunduh berkas template Anda:</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${driveLink}" target="_blank" style="background-color: #ff7a00; color: #ffffff; padding: 14px 28px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(255, 122, 0, 0.2);">
                Akses Template Desain
              </a>
            </div>
            
            <p style="font-size: 13px; color: #64748b; word-break: break-all;">Atau salin tautan berikut ke browser Anda:<br/>
            <a href="${driveLink}" target="_blank" style="color: #ea580c; text-decoration: underline;">${driveLink}</a></p>
            
            <div style="margin-top: 35px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8; text-align: center;">
              <p>Jika memiliki pertanyaan, silakan hubungi tim kami via WhatsApp di +62 851-3373-7623.</p>
              <p>© ${new Date().getFullYear()} Fanajah. All rights reserved.</p>
            </div>
          </div>
        </div>
      `;

      try {
        await sendSuggestionEmail({
          from: `"Fanajah Template" <${adminEmail}>`,
          to: order.email,
          subject: `🎁 Template Desain Anda (${displayPackageName}) Telah Siap!`,
          html: emailContent,
        });
      } catch (emailError) {
        console.error("Nodemailer failed to send template email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pembayaran terverifikasi! Link template desain telah dikirim ke email Anda.",
      driveLink,
    });
  } catch (error: any) {
    console.error("Confirm payment error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
