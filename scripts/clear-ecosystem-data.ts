import { neon } from "@neondatabase/serverless";

async function clearEcosystemData() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is not defined in environment variables");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("Truncating ecosystem tables...");
    
    await sql`
      TRUNCATE TABLE 
        tracking_events, 
        email_recipients, 
        keywords, 
        seo_projects, 
        email_campaigns, 
        crm_contacts, 
        user_smtp_settings, 
        ecosystem_usage_logs 
      RESTART IDENTITY CASCADE;
    `;
    
    console.log("✅ All ecosystem tables truncated and identity sequences reset successfully!");
  } catch (error) {
    console.error("❌ Failed to clear ecosystem data:", error);
    process.exit(1);
  }
}

clearEcosystemData();
