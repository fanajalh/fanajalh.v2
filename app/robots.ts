import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/private/'],
    },
    sitemap: 'https://fanajah.com/sitemap.xml',
  }
}
