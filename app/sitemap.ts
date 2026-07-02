import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fanajah.my.id"
  const currentDate = new Date().toISOString()

  return [
    // ─── Homepage (Landing Page Fanajah) ───
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    // ─── Poster Portfolio / Galeri Desain ───
    {
      url: `${baseUrl}/poster-portfolio`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    // ─── Studio Desain (Editor) ───
    {
      url: `${baseUrl}/studio`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // ─── Frames / Twibbon ───
    {
      url: `${baseUrl}/frames`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // ─── Payment / Order ───
    {
      url: `${baseUrl}/payment`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // ─── Login User ───
    {
      url: `${baseUrl}/loginUser`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    // ─── Cross-link: Ekosistem AllFanajalh (Portfolio Utama) ───
    {
      url: "https://allfanajalh.my.id",
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    // ─── Cross-link: KlikAjalah (SaaS Marketing) ───
    {
      url: "https://klikajalah.my.id",
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ]
}
