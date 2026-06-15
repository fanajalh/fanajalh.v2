import { neon } from "@neondatabase/serverless";

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is not defined in environment variables");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("Migrating crm_contacts table...");
    await sql`ALTER TABLE crm_contacts ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_crm_contacts_user_email ON crm_contacts(user_email);`;
    await sql`UPDATE crm_contacts SET user_email = 'admin@fanajah.com' WHERE user_email IS NULL;`;
    console.log("✅ crm_contacts table migrated.");

    console.log("Migrating seo_projects table...");
    await sql`ALTER TABLE seo_projects ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_seo_projects_user_email ON seo_projects(user_email);`;
    await sql`UPDATE seo_projects SET user_email = 'admin@fanajah.com' WHERE user_email IS NULL;`;
    console.log("✅ seo_projects table migrated.");

    console.log("Migrating keywords table...");
    await sql`ALTER TABLE keywords ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_keywords_user_email ON keywords(user_email);`;
    await sql`UPDATE keywords SET user_email = 'admin@fanajah.com' WHERE user_email IS NULL;`;
    console.log("✅ keywords table migrated.");

    console.log("Migrating tracking_events table...");
    await sql`ALTER TABLE tracking_events ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tracking_events_user_email ON tracking_events(user_email);`;
    await sql`UPDATE tracking_events SET user_email = 'admin@fanajah.com' WHERE user_email IS NULL;`;
    console.log("✅ tracking_events table migrated.");

    console.log("\n🎉 Database migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
