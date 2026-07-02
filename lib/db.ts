import { neon } from "@neondatabase/serverless";

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_FANAJALAH;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }
  return neon(databaseUrl);
}
