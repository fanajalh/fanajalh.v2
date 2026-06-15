import { neon } from "@neondatabase/serverless";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function resetGuestLogs() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set");
    return;
  }
  const sql = neon(url);
  console.log("Resetting guest logs from ecosystem_usage_logs...");
  const result = await sql`
    DELETE FROM ecosystem_usage_logs WHERE user_email IS NULL
  `;
  console.log("Reset successful. Guest logs deleted.");
}

resetGuestLogs().catch(console.error);
