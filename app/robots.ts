import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/loginUser/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/poster-portfolio/", "/studio/", "/frames/", "/product/"],
        disallow: ["/api/", "/loginUser/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
    ],
    sitemap: "https://fanajah.my.id/sitemap.xml",
    host: "https://fanajah.my.id",
  }
}
