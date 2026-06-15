import { neon } from "@neondatabase/serverless";

async function seedDevData() {
  const sql = neon(process.env.DATABASE_URL!);

  const devItems = [
    {
      title: "E-Commerce Mobile App",
      category: "APK",
      type: "Mobile Application",
      description: "Aplikasi belanja online dengan fitur real-time tracking, payment gateway integrasi, dan push notifications.",
      tech: "React Native, Firebase, Redux, Stripe",
      image: "https://images.unsplash.com/photo-1512928500222-77732a13cc70?w=800&q=80",
      color: "from-orange-500 to-rose-500",
      link: "#",
    },
    {
      title: "Corporate Dashboard Portal",
      category: "Web",
      type: "Web Application",
      description: "Dashboard admin komprehensif untuk manajemen data karyawan, analitik penjualan, dan pelaporan otomatis.",
      tech: "Next.js, TypeScript, Tailwind CSS, PostgreSQL",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      color: "from-blue-500 to-cyan-500",
      link: "#",
    },
    {
      title: "Sistem Manajemen Kost",
      category: "Web",
      type: "Web Application",
      description: "Platform untuk pemilik kost mengelola kamar, tagihan, dan keluhan penyewa dengan sistem notifikasi WhatsApp.",
      tech: "React, Node.js, Express, MongoDB",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      color: "from-emerald-500 to-teal-500",
      link: "#",
    },
    {
      title: "Task Management App",
      category: "APK",
      type: "Mobile Application",
      description: "Aplikasi produktivitas untuk tim dengan fitur kanban board, time tracking, dan kolaborasi real-time.",
      tech: "Flutter, Dart, Firebase, SQLite",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      color: "from-purple-500 to-indigo-500",
      link: "#",
    },
    {
      title: "Landing Page SaaS",
      category: "Web",
      type: "Website",
      description: "Desain landing page modern dan responsif untuk startup SaaS dengan animasi 3D dan optimasi SEO.",
      tech: "Vue.js, Nuxt, GSAP, Framer Motion",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      color: "from-pink-500 to-rose-400",
      link: "#",
    },
    {
      title: "Aplikasi Kasir (POS)",
      category: "APK",
      type: "Tablet Application",
      description: "Sistem Point of Sales offline-first untuk restoran dengan fitur manajemen meja, inventaris, dan cetak struk Bluetooth.",
      tech: "Kotlin, Android Studio, Room DB, Coroutines",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      color: "from-amber-500 to-orange-400",
      link: "#",
    }
  ];

  try {
    const existing = await sql`SELECT COUNT(*) FROM portfolio_dev`;
    const count = parseInt(existing[0].count);

    if (count > 0) {
      console.log(`Table portfolio_dev already has ${count} records. Skipping seeding.`);
      return;
    }

    console.log("Seeding dev portfolio...");
    for (const item of devItems) {
      await sql`
        INSERT INTO portfolio_dev (title, category, type, description, tech, image, color, link)
        VALUES (${item.title}, ${item.category}, ${item.type}, ${item.description}, ${item.tech}, ${item.image}, ${item.color}, ${item.link})
      `;
    }
    console.log("Dev portfolio successfully seeded.");

  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seedDevData();
