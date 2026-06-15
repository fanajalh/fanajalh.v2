import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

// Manually parse .env as a fallback
try {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || "").trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  console.warn("Failed to manually read .env file:", e);
}

async function cleanupIps() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined in environment variables");
    return;
  }
  
  const sql = neon(databaseUrl);

  try {
    console.log("Anonymizing existing guest IP addresses in ecosystem_usage_logs...");
    const res1 = await sql`
      UPDATE ecosystem_usage_logs 
      SET ip_address = MD5(ip_address) 
      WHERE user_email IS NULL AND ip_address IS NOT NULL AND LENGTH(ip_address) <= 45
    `;
    console.log("✅ Anonymized ecosystem_usage_logs.");

    console.log("Anonymizing guest emails (which contain IPs) in crm_contacts...");
    const res2 = await sql`
      UPDATE crm_contacts 
      SET user_email = 'guest:' || MD5(SUBSTRING(user_email FROM 7)) 
      WHERE user_email LIKE 'guest:%'
    `;
    console.log("✅ Anonymized crm_contacts.");

    console.log("Anonymizing guest emails in tracking_events...");
    const res3 = await sql`
      UPDATE tracking_events 
      SET user_email = 'guest:' || MD5(SUBSTRING(user_email FROM 7)) 
      WHERE user_email LIKE 'guest:%'
    `;
    console.log("✅ Anonymized tracking_events.");

    console.log("🎉 Database guest IP anonymization completed successfully!");
  } catch (error) {
    console.error("❌ Error running cleanup:", error);
  }
}

cleanupIps();
