import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

async function createAllTables() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined in environment variables");
    process.exit(1);
  }

  console.log("Connecting to Fanajalah Database:", databaseUrl);
  const sql = neon(databaseUrl);

  try {
    // 1. Users Table
    console.log("Creating users table...");
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ users table created.");

    // Seed Admin user if not exists
    const adminEmail = "admin@fanajah.com";
    const existingAdmin = await sql`SELECT id FROM users WHERE email = ${adminEmail}`;
    if (existingAdmin.length === 0) {
      console.log("Seeding default admin user...");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await sql`
        INSERT INTO users (name, email, password, role)
        VALUES ('Admin Fanajah', ${adminEmail}, ${hashedPassword}, 'admin')
      `;
      console.log("✅ Default admin user created (admin@fanajah.com / admin123).");
    }

    // 2. OTP Send Log
    console.log("Creating otp_send_log table...");
    await sql`
      CREATE TABLE IF NOT EXISTS otp_send_log (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        purpose VARCHAR(100) NOT NULL,
        ip VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ otp_send_log table created.");

    // 3. Email OTPs
    console.log("Creating email_otps table...");
    await sql`
      CREATE TABLE IF NOT EXISTS email_otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        code_hash VARCHAR(255) NOT NULL,
        purpose VARCHAR(100) NOT NULL,
        attempt_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        consumed_at TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      )
    `;
    console.log("✅ email_otps table created.");

    // 4. Suggestions Table
    console.log("Creating suggestions table...");
    await sql`
      CREATE TABLE IF NOT EXISTS suggestions (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(255),
        user_email VARCHAR(255),
        category VARCHAR(100) NOT NULL,
        saran TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        type VARCHAR(50) DEFAULT 'general',
        author VARCHAR(255),
        upvotes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ suggestions table created.");

    // 5. Suggestion Replies Table
    console.log("Creating suggestion_replies table...");
    await sql`
      CREATE TABLE IF NOT EXISTS suggestion_replies (
        id SERIAL PRIMARY KEY,
        suggestion_id INT REFERENCES suggestions(id) ON DELETE CASCADE,
        author VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ suggestion_replies table created.");

    // 6. Orders Table
    console.log("Creating orders table...");
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        company VARCHAR(255),
        service VARCHAR(100) NOT NULL,
        package VARCHAR(100) NOT NULL,
        title VARCHAR(255),
        description TEXT,
        dimensions VARCHAR(100),
        colors VARCHAR(100),
        deadline VARCHAR(100),
        additional_info TEXT,
        total_price INT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ orders table created.");

    // 7. Website Settings Table
    console.log("Creating website_settings table...");
    await sql`
      CREATE TABLE IF NOT EXISTS website_settings (
        id INT PRIMARY KEY,
        settings JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ website_settings table created.");

    // Seed default website settings if not exists
    const existingSettings = await sql`SELECT id FROM website_settings WHERE id = 1`;
    if (existingSettings.length === 0) {
      console.log("Seeding default website settings...");
      const defaultSettings = {
        orderPageOpen: true,
        premiumPageOpen: true,
        services: []
      };
      await sql`
        INSERT INTO website_settings (id, settings)
        VALUES (1, ${JSON.stringify(defaultSettings)})
      `;
      console.log("✅ Default website settings seeded.");
    }

    // 8. Photobooth Shares Table
    console.log("Creating photobooth_shares table...");
    await sql`
      CREATE TABLE IF NOT EXISTS photobooth_shares (
        token VARCHAR(255) PRIMARY KEY,
        image_data TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL
      )
    `;
    console.log("✅ photobooth_shares table created.");

    // 9. Photobooth Frames Table
    console.log("Creating photobooth_frames table...");
    await sql`
      CREATE TABLE IF NOT EXISTS photobooth_frames (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        slots INT DEFAULT 4,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        uploaded_by INT,
        uploader_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ photobooth_frames table created.");

    // 10. Premium Categories Table
    console.log("Creating premium_categories table...");
    await sql`
      CREATE TABLE IF NOT EXISTS premium_categories (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(100),
        active_color VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0
      )
    `;
    console.log("✅ premium_categories table created.");

    // Seed default premium categories if empty
    const categoryCount = await sql`SELECT COUNT(*)::int as count FROM premium_categories`;
    if (categoryCount[0].count === 0) {
      console.log("Seeding premium categories...");
      await sql`
        INSERT INTO premium_categories (id, name, icon, active_color, sort_order)
        VALUES 
        ('canva', 'Canva', 'Sparkles', 'text-sky-500', 1),
        ('spotify', 'Spotify', 'Music', 'text-emerald-500', 2),
        ('youtube', 'YouTube Premium', 'Play', 'text-rose-500', 3),
        ('netflix', 'Netflix', 'Tv', 'text-red-600', 4)
      `;
      console.log("✅ Default premium categories seeded.");
    }

    // 11. Premium Products Table
    console.log("Creating premium_products table...");
    await sql`
      CREATE TABLE IF NOT EXISTS premium_products (
        id VARCHAR(100) PRIMARY KEY,
        category_id VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        duration VARCHAR(100) NOT NULL,
        price INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        popular BOOLEAN DEFAULT FALSE
      )
    `;
    console.log("✅ premium_products table created.");

    // 12. Premium Stock Table
    console.log("Creating premium_stock table...");
    await sql`
      CREATE TABLE IF NOT EXISTS premium_stock (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(100) REFERENCES premium_products(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'AVAILABLE',
        buyer_wa VARCHAR(50),
        order_token VARCHAR(255),
        sold_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ premium_stock table created.");

    // 13. Premium Orders Table
    console.log("Creating premium_orders table...");
    await sql`
      CREATE TABLE IF NOT EXISTS premium_orders (
        id SERIAL PRIMARY KEY,
        order_token VARCHAR(255) UNIQUE NOT NULL,
        product_id VARCHAR(100) REFERENCES premium_products(id) ON DELETE SET NULL,
        buyer_wa VARCHAR(50) NOT NULL,
        total_price INT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ premium_orders table created.");

    // 14. Features News Table
    console.log("Creating features_news table...");
    await sql`
      CREATE TABLE IF NOT EXISTS features_news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100) DEFAULT 'Feature Update',
        excerpt TEXT,
        content TEXT NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ features_news table created.");

    // 15. APK Settings Table
    console.log("Creating apk_settings table...");
    await sql`
      CREATE TABLE IF NOT EXISTS apk_settings (
        id SERIAL PRIMARY KEY,
        version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
        file_url TEXT NOT NULL DEFAULT '/AllFanajalh.apk',
        file_size VARCHAR(50) NOT NULL DEFAULT '~25 MB',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ apk_settings table created.");

    // 16. Top Products Table
    console.log("Creating top_products table...");
    await sql`
      CREATE TABLE IF NOT EXISTS top_products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        default_price VARCHAR(100),
        icon VARCHAR(100),
        badge VARCHAR(100),
        badge_class VARCHAR(255),
        hover_bg VARCHAR(255),
        hover_icon VARCHAR(255),
        link VARCHAR(255),
        badge_icon VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ top_products table created.");

    console.log("\n🎉 All Fanajah tables initialized successfully!");
  } catch (error) {
    console.error("❌ Failed to initialize database tables:", error);
    process.exit(1);
  }
}

createAllTables();
