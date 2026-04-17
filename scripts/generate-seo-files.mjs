import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.resolve(__dirname, '../public')
const today = new Date().toISOString().slice(0, 10)

const languages = ['hy', 'en', 'ru']
const routes = [
  '/',
  '/places',
  '/routes',
  '/ai',
  '/help',
  '/faq',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
]

async function readEnvValue(key) {
  for (const fileName of ['.env.local', '.env']) {
    try {
      const source = await readFile(path.join(rootDir, fileName), 'utf8')

      for (const line of source.split(/\r?\n/)) {
        const trimmedLine = line.trim()

        if (!trimmedLine || trimmedLine.startsWith('#')) {
          continue
        }

        const [rawKey, ...rawValue] = trimmedLine.split('=')

        if (rawKey?.trim() !== key) {
          continue
        }

        return rawValue.join('=').trim().replace(/^['"]|['"]$/g, '')
      }
    } catch {
      continue
    }
  }

  return null
}

const configuredSiteUrl =
  process.env.VITE_SITE_URL ||
  (await readEnvValue('VITE_SITE_URL')) ||
  'https://jermuktravel.am'
const siteUrl = configuredSiteUrl.replace(/\/+$/, '')

function buildLocalizedUrl(route, language) {
  const pathName = route === '/' ? '/' : route
  return `${siteUrl}${pathName}?lang=${language}`
}

function buildAlternateLinks(route) {
  return languages
    .map(
      (language) =>
        `<xhtml:link rel="alternate" hreflang="${language}" href="${buildLocalizedUrl(route, language)}" />`,
    )
    .concat(`<xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${route === '/' ? '/' : route}" />`)
    .join('')
}

function buildSitemapXml() {
  const urls = routes.flatMap((route) =>
    languages.map(
      (language) => `<url>
  <loc>${buildLocalizedUrl(route, language)}</loc>
  <lastmod>${today}</lastmod>
  <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
  <priority>${route === '/' ? '1.0' : route === '/places' || route === '/routes' ? '0.9' : '0.7'}</priority>
  ${buildAlternateLinks(route)}
</url>`,
    ),
  )

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="https://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`
}

function buildRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/login

Sitemap: ${siteUrl}/sitemap.xml
`
}

await mkdir(publicDir, { recursive: true })
await writeFile(path.join(publicDir, 'sitemap.xml'), buildSitemapXml(), 'utf8')
await writeFile(path.join(publicDir, 'robots.txt'), buildRobotsTxt(), 'utf8')
