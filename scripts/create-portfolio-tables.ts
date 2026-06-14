import { neon } from "@neondatabase/serverless";

async function createTables() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    console.log("Creating portfolio_designs table...");
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_designs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("portfolio_designs table created.");

    console.log("Creating portfolio_dev table...");
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_dev (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        type VARCHAR(100),
        description TEXT,
        tech TEXT,
        image VARCHAR(255) NOT NULL,
        github_link VARCHAR(255),
        link VARCHAR(255),
        color VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("portfolio_dev table created.");

  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

createTables();
