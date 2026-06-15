import { neon } from "@neondatabase/serverless";

async function createEcosystemTables() {
  const sql = neon(process.env.DATABASE_URL!);

  try {
    // 1. CRM Contacts (Jantung Sistem)
    console.log("Creating crm_contacts table...");
    await sql`
      CREATE TABLE IF NOT EXISTS crm_contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        website VARCHAR(500),
        address TEXT,
        category VARCHAR(100),
        status VARCHAR(20) DEFAULT 'NEW',
        source VARCHAR(50) DEFAULT 'manual',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ crm_contacts created.");

    // 2. User SMTP Settings
    console.log("Creating user_smtp_settings table...");
    await sql`
      CREATE TABLE IF NOT EXISTS user_smtp_settings (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL UNIQUE,
        smtp_host VARCHAR(255) NOT NULL DEFAULT 'smtp.gmail.com',
        smtp_port INT NOT NULL DEFAULT 587,
        smtp_email VARCHAR(255) NOT NULL,
        smtp_password TEXT NOT NULL,
        display_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ user_smtp_settings created.");

    // 3. Email Campaigns
    console.log("Creating email_campaigns table...");
    await sql`
      CREATE TABLE IF NOT EXISTS email_campaigns (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        template_html TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'draft',
        total_recipients INT DEFAULT 0,
        sent_count INT DEFAULT 0,
        open_count INT DEFAULT 0,
        reply_count INT DEFAULT 0,
        scheduled_at TIMESTAMP,
        sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ email_campaigns created.");

    // 4. Email Recipients
    console.log("Creating email_recipients table...");
    await sql`
      CREATE TABLE IF NOT EXISTS email_recipients (
        id SERIAL PRIMARY KEY,
        campaign_id INT REFERENCES email_campaigns(id) ON DELETE CASCADE,
        contact_id INT REFERENCES crm_contacts(id) ON DELETE SET NULL,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        sent_at TIMESTAMP,
        opened_at TIMESTAMP,
        replied_at TIMESTAMP,
        tracking_id VARCHAR(100) UNIQUE
      )
    `;
    console.log("✅ email_recipients created.");

    // 5. SEO Projects
    console.log("Creating seo_projects table...");
    await sql`
      CREATE TABLE IF NOT EXISTS seo_projects (
        id SERIAL PRIMARY KEY,
        contact_id INT REFERENCES crm_contacts(id) ON DELETE SET NULL,
        business_name VARCHAR(255) NOT NULL,
        website VARCHAR(500),
        product TEXT,
        meta_title VARCHAR(500),
        meta_description TEXT,
        blog_article TEXT,
        faq_schema TEXT,
        status VARCHAR(20) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ seo_projects created.");

    // 6. Keywords
    console.log("Creating keywords table...");
    await sql`
      CREATE TABLE IF NOT EXISTS keywords (
        id SERIAL PRIMARY KEY,
        seo_project_id INT REFERENCES seo_projects(id) ON DELETE CASCADE,
        contact_id INT REFERENCES crm_contacts(id) ON DELETE SET NULL,
        keyword VARCHAR(500) NOT NULL,
        search_volume INT,
        difficulty VARCHAR(20),
        current_position INT,
        previous_position INT,
        traffic_estimate INT,
        last_checked TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ keywords created.");

    // 7. Tracking Events
    console.log("Creating tracking_events table...");
    await sql`
      CREATE TABLE IF NOT EXISTS tracking_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        reference_id INT,
        reference_type VARCHAR(50),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ tracking_events created.");

    console.log("\n🎉 All ecosystem tables created successfully!");

  } catch (error) {
    console.error("❌ Error creating tables:", error);
  }
}

createEcosystemTables();
