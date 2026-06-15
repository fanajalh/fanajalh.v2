import { getDb } from "@/lib/db";
import { getClientIp } from "@/lib/request-ip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export interface LimitCheckResult {
  allowed: boolean;
  message?: string;
  role?: string;
  ip?: string;
  email?: string;
}

export const PREREQUISITES: Record<string, string> = {
  crm: "lead_finder",
  blast: "crm",
  keyword: "crm",
  seo: "keyword",
  tracking: "blast",
  serp: "seo"
};

export async function checkEcosystemLimit(req: Request, feature: string, requestedCount: number = 1): Promise<LimitCheckResult> {
  const session = await getServerSession(authOptions);
  const sql = getDb();
  const ip = getClientIp(req) || "unknown";

  const userEmail = session?.user?.email;
  const role = (session?.user as any)?.role || "guest";

  // 1. Admin/Premium has unlimited access
  if (role === "admin" || role === "premium") {
    return { allowed: true, role };
  }

  // 2. Guest Progression & Limit checks
  if (!userEmail) {
    // Check if guest has used other features
    const otherFeatures = await sql`
      SELECT DISTINCT feature FROM ecosystem_usage_logs 
      WHERE ip_address = ${ip} AND feature != ${feature}
    `;
    if (otherFeatures.length > 0) {
      const formattedFeature = otherFeatures[0].feature.replace('_', ' ').toUpperCase();
      return { 
        allowed: false, 
        message: `Sebagai tamu, Anda terkunci pada fitur "${formattedFeature}". Silakan masuk/daftar akun gratis untuk membuka semua fitur lainnya!` 
      };
    }

    if (requestedCount === 0) {
      return { allowed: true, role: "guest", ip };
    }

    if (feature === "blast") {
      // Check blast count
      const [blastSum] = await sql`
        SELECT COALESCE(SUM(usage_count), 0) as total FROM ecosystem_usage_logs
        WHERE ip_address = ${ip} AND feature = 'blast'
      `;
      const total = parseInt(blastSum.total || "0");
      if (total + requestedCount > 5) {
        return {
          allowed: false,
          message: `Batas pengiriman email untuk tamu adalah 5 email (Anda sudah mengirim ${total}). Silakan daftar/login untuk mengirim hingga 45 email!`
        };
      }
    } else {
      // Check other features count
      const [featureCount] = await sql`
        SELECT COUNT(*) as total FROM ecosystem_usage_logs
        WHERE ip_address = ${ip} AND feature = ${feature}
      `;
      const total = parseInt(featureCount.total || "0");
      if (total >= 1) {
        const formattedFeature = feature.replace('_', ' ').toUpperCase();
        return {
          allowed: false,
          message: `Batas input tamu untuk fitur "${formattedFeature}" telah habis (maks 1 kali). Silakan daftar/login untuk membuka 5 kali input per 5 hari!`
        };
      }
    }

    return { allowed: true, role: "guest", ip };
  }

  // 3. Logged-in Free User Progression checks (Disabled: all features unlocked for logged-in users)
  /*
  const prereq = PREREQUISITES[feature];
  if (prereq) {
    const logCheck = await sql`
      SELECT COUNT(*) as total FROM ecosystem_usage_logs
      WHERE user_email = ${userEmail} AND feature = ${prereq}
    `;
    const hasPrereq = parseInt(logCheck[0]?.total || "0") > 0;
    if (!hasPrereq) {
      const formattedPrereq = prereq.replace('_', ' ').toUpperCase();
      const formattedTarget = feature.replace('_', ' ').toUpperCase();
      return {
        allowed: false,
        message: `Akses ditolak. Anda harus menggunakan fitur "${formattedPrereq}" terlebih dahulu sebelum membuka "${formattedTarget}".`
      };
    }
  }
  */

  if (requestedCount === 0) {
    return { allowed: true, role: "user", ip, email: userEmail };
  }

  // 4. Logged-in Free User limit checks
  if (feature === "blast") {
    const [blastSum] = await sql`
      SELECT COALESCE(SUM(usage_count), 0) as total FROM ecosystem_usage_logs
      WHERE user_email = ${userEmail} AND feature = 'blast'
    `;
    const total = parseInt(blastSum.total || "0");
    if (total + requestedCount > 45) {
      return {
        allowed: false,
        message: `Batas email blast gratis Anda telah habis (maks 45 email, terkirim: ${total}). Silakan hubungi admin untuk upgrade ke paket Premium!`
      };
    }
  } else {
    // Other features limit: max 5 times/inputs per 5 days (across all non-blast features combined)
    const [usageCount] = await sql`
      SELECT COUNT(*) as total FROM ecosystem_usage_logs
      WHERE user_email = ${userEmail} 
      AND feature != 'blast'
      AND created_at >= NOW() - INTERVAL '5 days'
    `;
    const total = parseInt(usageCount.total || "0");
    if (total >= 5) {
      return {
        allowed: false,
        message: `Batas gratis non-blast Anda (5 input per 5 hari) telah habis. Anda telah menginput ${total} kali. Silakan hubungi admin untuk upgrade ke paket Premium!`
      };
    }
  }

  return { allowed: true, role: "user", email: userEmail };
}

export async function logEcosystemUsage(feature: string, usageCount: number, ip: string | null, email: string | null) {
  const sql = getDb();
  await sql`
    INSERT INTO ecosystem_usage_logs (ip_address, user_email, feature, usage_count)
    VALUES (${ip || null}, ${email || null}, ${feature}, ${usageCount})
  `;
}
