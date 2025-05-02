import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/dashboard/',
        '/checkout/',
        '/_next/',
      ],
    },
    sitemap: 'https://www.editoravinde.com.br/api/sitemap',
  }
} 