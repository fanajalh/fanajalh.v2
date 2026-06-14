import { neon } from "@neondatabase/serverless";

async function checkColumns() {
  const sql = neon(process.env.DATABASE_URL!);
  
  const columns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'featured_works'
  `;
  console.log("Featured Works Columns:", columns);
}

checkColumns().catch(console.error);
