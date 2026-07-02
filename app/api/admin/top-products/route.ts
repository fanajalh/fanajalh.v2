import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const sql = getDb();
    
    // Auto-create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS top_products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        default_price VARCHAR(100),
        icon VARCHAR(100),
        badge VARCHAR(100),
        badge_class VARCHAR(255),
        hover_bg VARCHAR(255),
        hover_icon VARCHAR(255),
        link VARCHAR(255),
        badge_icon VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Check if table is empty
    const countResult = await sql`SELECT COUNT(*)::int as count FROM top_products`;
    const count = countResult[0]?.count || 0;

    if (count === 0) {
      // Seed default items
      await sql`
        INSERT INTO top_products (name, default_price, icon, badge, badge_class, hover_bg, hover_icon, link, badge_icon)
        VALUES 
        ('Desain Poster', '15.000', 'Palette', 'TOP', 'bg-yellow-400 text-yellow-900', 'group-hover:bg-blue-50', 'group-hover:text-blue-500', '/payment?package=basic', 'Star'),
        ('Desain Bisnis', '25.000', 'Briefcase', 'HOT', 'bg-orange-500 text-white', 'group-hover:bg-rose-50', 'group-hover:text-rose-500', '/payment?package=professional', 'Zap')
      `;
    }

    const data = await sql`SELECT * FROM top_products ORDER BY id ASC`;
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error in GET /api/admin/top-products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sql = getDb();
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, default_price, icon, badge, badge_class, hover_bg, hover_icon, link, badge_icon } = await req.json();

    if (!name) return NextResponse.json({ error: "Name wajib diisi" }, { status: 400 });

    const result = await sql`
      INSERT INTO top_products (
        name, 
        default_price, 
        icon, 
        badge, 
        badge_class, 
        hover_bg, 
        hover_icon, 
        link, 
        badge_icon
      )
      VALUES (
        ${name},
        ${default_price || '10.000'},
        ${icon || 'Sparkles'},
        ${badge || 'TOP'},
        ${badge_class || 'bg-yellow-400 text-yellow-900'},
        ${hover_bg || 'group-hover:bg-blue-50'},
        ${hover_icon || 'group-hover:text-blue-500'},
        ${link || '/payment'},
        ${badge_icon || 'Star'}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error("Error in POST /api/admin/top-products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
