import { type NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, packageId, title } = await request.json();

    if (!name || !email || !phone || !packageId) {
      return NextResponse.json(
        { success: false, message: "Semua field (Nama, Email, WhatsApp, Paket) wajib diisi." },
        { status: 400 }
      );
    }

    const sql = getDb();
    
    // Fetch website settings to get dynamic pricing
    const settingsRows = await sql`SELECT settings FROM website_settings WHERE id = 1`;
    
    let basicPrice = 15000;
    let professionalPrice = 20000;
    let enterprisePrice = 25000;

    if (settingsRows.length > 0 && settingsRows[0].settings?.services) {
      const dbServices = settingsRows[0].settings.services;
      const basicDb = dbServices.find((s: any) => s.id === "basic");
      const proDb = dbServices.find((s: any) => s.id === "professional");
      const entDb = dbServices.find((s: any) => s.id === "enterprise");

      if (basicDb) basicPrice = basicDb.price;
      if (proDb) professionalPrice = proDb.price;
      if (entDb) enterprisePrice = entDb.price;
    }

    const packagePrices: { [key: string]: number } = {
      basic: basicPrice,
      professional: professionalPrice,
      enterprise: enterprisePrice,
    };

    let basePrice = packagePrices[packageId.toLowerCase()];

    if (basePrice === undefined) {
      // Find dynamic price from products or portfolio_designs table
      const dbProduct = await sql`SELECT price_discount FROM products WHERE title = ${title} LIMIT 1`;
      if (dbProduct.length > 0) {
        basePrice = Number(dbProduct[0].price_discount) || 10000;
      } else {
        const dbPortfolio = await sql`SELECT price_discount FROM portfolio_designs WHERE title = ${title} LIMIT 1`;
        if (dbPortfolio.length > 0) {
          basePrice = Number(dbPortfolio[0].price_discount) || 10000;
        } else {
          // Fallback if not found in db
          basePrice = 10000;
        }
      }
    }

    const totalPrice = basePrice;
    
    const randomSuffix = Math.floor(100 + Math.random() * 900); // 3 random digits
    const orderNumber = `FNT-${Date.now().toString().slice(-8)}${randomSuffix}`;
    
    // Insert pending order transaction into 'orders' table
    const result = await sql`
      INSERT INTO orders (order_number, name, email, phone, service, package, total_price, status, title)
      VALUES (${orderNumber}, ${name}, ${email}, ${phone}, 'template', ${packageId}, ${totalPrice}, 'pending', ${title || null})
      RETURNING *
    `;

    // Fetch bank/QRIS info if available
    let bankInfo = {
      nmid: "",
      bankName: "",
      accountName: "",
      qrisAvailable: false
    };
    try {
      const qrisRows = await sql`
        SELECT nmid, bank_name, account_name, qr_image_base64
        FROM qris_settings
        ORDER BY id DESC
        LIMIT 1
      `;
      if (qrisRows.length > 0) {
        bankInfo.nmid = qrisRows[0].nmid || "";
        bankInfo.bankName = qrisRows[0].bank_name || "";
        bankInfo.accountName = qrisRows[0].account_name || "";
        bankInfo.qrisAvailable = !!qrisRows[0].qr_image_base64;
      }
    } catch (err) {
      console.warn("qris_settings table query failed:", err);
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: result[0].order_number,
        totalPrice: result[0].total_price,
        packageId: result[0].package,
        title: result[0].title,
        name: result[0].name,
        email: result[0].email,
      },
      bankInfo,
    });
  } catch (error: any) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
