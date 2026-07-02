import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const sql = getDb();
    const data = await sql`
      SELECT id, title, description, description_full, features, price_original, price_discount, image, popular, active, category_id, stock, items_sold, created_at, updated_at
      FROM products 
      WHERE active = true 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ success: true, data }, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
    });
  } catch (error: any) {
    console.error("GET public products error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
