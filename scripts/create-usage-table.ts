import { neon } from "@neondatabase/serverless";

async function createUsageTable() {
  const sql = neon(process.env.DATABASE_URL!);

  try {
    console.log("Creating ecosystem_usage_logs table...");
    await sql`
      CREATE TABLE IF NOT EXISTS ecosystem_usage_logs (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(50),
        user_email VARCHAR(255),
        feature VARCHAR(50) NOT NULL,
        usage_count INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ ecosystem_usage_logs created.");
  } catch (error) {
    console.error("❌ Error creating table:", error);
  }
}

createUsageTable();
