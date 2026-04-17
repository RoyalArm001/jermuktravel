import { useEffect } from 'react'
import type { Language, MorePageId, SiteLanguageContent } from '../types'

type PublicSeoPath =
  | '/'
  | '/places'
  | '/routes'
  | '/ai'
  | '/help'
  | '/faq'
  | '/about'
  | '/contact'
  | '/terms'
  | '/privacy'

type StructuredDataNode = Record<string, unknown>

interface SeoAlternate {
  href: string
  hrefLang: string
}

interface SeoConfig {
  title: string
  description: string
  keywords?: string[]
  robots?: string
  canonical?: string
  alternates?: SeoAlternate[]
  ogType?: string
  locale?: string
  localeAlternates?: string[]
  image?: string
  imageAlt?: string
  structuredData?: StructuredDataNode[]
}

interface BuildPublicSeoInput {
  pathname: string
  language: Language
  copy: SiteLanguageContent
}

const siteName = 'Jermuk Travel'
const defaultSiteUrl = 'https://jermuktravel.am'

const localeMap: Record<Language, string> = {
  hy: 'hy-AM',
  en: 'en-US',
  ru: 'ru-RU',
}

const ogLocaleMap: Record<Language, string> = {
  hy: 'hy_AM',
  en: 'en_US',
  ru: 'ru_RU',
}

const cityNameMap: Record<Language, string> = {
  hy: 'Ջերմուկ',
  en: 'Jermuk',
  ru: 'Джермук',
}

const routeKeywordMap: Record<Language, Record<PublicSeoPath, string[]>> = {
  hy: {
    '/': ['Ջերմուկ', 'Ջերմուկ Թրավել', 'Ջերմուկ հանգիստ', 'Ջերմուկ ուղեցույց', 'Ջերմուկ զբոսաշրջություն'],
    '/places': ['Ջերմուկ վայրեր', 'Ջերմուկ տեսարժան վայրեր', 'Ջերմուկ ջրվեժ', 'Ջերմուկ հանքային ջուր'],
    '/routes': ['Ջերմուկ երթուղիներ', 'Ջերմուկ քարտեզ', 'Ջերմուկ ուղղություններ', 'Ջերմուկ ճանապարհներ'],
    '/ai': ['Jermuk AI', 'Ջերմուկ AI', 'Ջերմուկ օգնական', 'Ջերմուկ հարց ու պատասխան'],
    '/help': ['Ջերմուկ օգնություն', 'Jermuk help', 'Ջերմուկ ուղեցույց օգնություն'],
    '/faq': ['Ջերմուկ FAQ', 'Ջերմուկ հարցեր', 'Ջերմուկ հաճախ տրվող հարցեր'],
    '/about': ['Jermuk Travel մասին', 'Ջերմուկ քաղաքի թվային ուղեցույց'],
    '/contact': ['Ջերմուկ կոնտակտ', 'Jermuk Travel կապ', 'Ջերմուկ կապ մեզ հետ'],
    '/terms': ['Jermuk Travel պայմաններ', 'Ջերմուկ կայքի պայմաններ'],
    '/privacy': ['Jermuk Travel գաղտնիություն', 'Ջերմուկ privacy'],
  },
  en: {
    '/': ['Jermuk', 'Jermuk Travel', 'Jermuk guide', 'Jermuk tourism', 'Jermuk wellness'],
    '/places': ['Jermuk places', 'Jermuk attractions', 'Jermuk waterfall', 'Jermuk mineral water'],
    '/routes': ['Jermuk routes', 'Jermuk map', 'Jermuk directions', 'Jermuk travel routes'],
    '/ai': ['Jermuk AI', 'Jermuk travel assistant', 'AI travel guide Jermuk'],
    '/help': ['Jermuk help', 'Jermuk guide help', 'visitor help Jermuk'],
    '/faq': ['Jermuk FAQ', 'Jermuk questions', 'travel FAQ Jermuk'],
    '/about': ['About Jermuk Travel', 'Jermuk digital guide'],
    '/contact': ['Contact Jermuk Travel', 'Jermuk contact', 'travel contact Jermuk'],
    '/terms': ['Jermuk Travel terms', 'website terms Jermuk'],
    '/privacy': ['Jermuk Travel privacy', 'privacy policy Jermuk'],
  },
  ru: {
    '/': ['Джермук', 'Jermuk Travel', 'гид по Джермуку', 'туризм Джермук', 'отдых Джермук'],
    '/places': ['места Джермука', 'достопримечательности Джермука', 'водопад Джермук'],
    '/routes': ['маршруты Джермук', 'карта Джермук', 'направления Джермук'],
    '/ai': ['Jermuk AI', 'AI помощник Джермук', 'гид AI Джермук'],
    '/help': ['помощь Джермук', 'guide help Jermuk'],
    '/faq': ['FAQ Джермук', 'вопросы Джермук'],
    '/about': ['о Jermuk Travel', 'цифровой гид Джермук'],
    '/contact': ['контакты Джермук', 'связаться Jermuk Travel'],
    '/terms': ['условия Jermuk Travel', 'условия сайта Джермук'],
    '/privacy': ['конфиденциальность Jermuk Travel', 'privacy Джермук'],
  },
}

const staticPageIdMap: Record<Exclude<PublicSeoPath, '/' | '/places' | '/routes' | '/ai'>, MorePageId> = {
  '/help': 'help',
  '/faq': 'faq',
  '/about': 'about',
  '/contact': 'contact',
  '/terms': 'terms',
  '/privacy': 'privacy',
}

function getWebPageType(pathname: PublicSeoPath) {
  if (pathname === '/places' || pathname === '/routes') {
    return 'CollectionPage'
  }

  if (pathname === '/faq') {
    return 'FAQPage'
  }

  if (pathname === '/contact') {
    return 'ContactPage'
  }

  if (pathname === '/about') {
    return 'AboutPage'
  }

  return 'WebPage'
}

function normalizePath(pathname: string): PublicSeoPath {
  if (
    pathname === '/places' ||
    pathname === '/routes' ||
    pathname === '/ai' ||
    pathname === '/help' ||
    pathname === '/faq' ||
    pathname === '/about' ||
    pathname === '/contact' ||
    pathname === '/terms' ||
    pathname === '/privacy'
  ) {
    return pathname
  }

  return '/'
}

export function getSiteBaseUrl() {
  const configuredUrl = import.meta.env.VITE_SITE_URL?.trim()

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, '')
  }

  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/+$/, '')
  }

  return defaultSiteUrl
}

export function buildLocalizedPath(pathname: string, language: Language) {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  return `${normalizedPath}?lang=${language}`
}

function buildPathUrl(pathname: PublicSeoPath) {
  const baseUrl = getSiteBaseUrl()
  const path = pathname === '/' ? '/' : pathname
  return `${baseUrl}${path}`
}

function buildPublicUrl(pathname: PublicSeoPath, language: Language) {
  return `${getSiteBaseUrl()}${buildLocalizedPath(pathname, language)}`
}

function getPageHeading(pathname: PublicSeoPath, language: Language, copy: SiteLanguageContent) {
  if (pathname === '/') {
    return copy.hero.title
  }

  if (pathname === '/places') {
    return copy.placesSection.title
  }

  if (pathname === '/routes') {
    return language === 'hy'
      ? 'Ջերմուկի երթուղիներ և քարտեզ'
      : language === 'ru'
        ? 'Маршруты и карта Джермука'
        : 'Jermuk routes and map'
  }

  if (pathname === '/ai') {
    return copy.aiSection.title
  }

  return copy.infoPages[staticPageIdMap[pathname]].title
}

function getPageDescription(pathname: PublicSeoPath, language: Language, copy: SiteLanguageContent) {
  if (pathname === '/') {
    return `${copy.hero.subtitle} ${copy.overview.description}`.trim()
  }

  if (pathname === '/places') {
    return copy.placesSection.description
  }

  if (pathname === '/routes') {
    return language === 'hy'
      ? 'Բացահայտիր Ջերմուկի երթուղիները, տես interactive քարտեզը և արագ պլանավորիր քո այցը քաղաքի գլխավոր կանգառներով։'
      : language === 'ru'
        ? 'Откройте маршруты Джермука, интерактивную карту и быстро спланируйте поездку по главным остановкам города.'
        : 'Explore Jermuk routes, the interactive map, and practical directions for planning your visit.'
  }

  if (pathname === '/ai') {
    return copy.aiSection.description
  }

  return copy.infoPages[staticPageIdMap[pathname]].description
}

function getPageLabel(pathname: PublicSeoPath, copy: SiteLanguageContent) {
  if (pathname === '/') {
    return copy.navigation.discover
  }

  if (pathname === '/places') {
    return copy.navigation.places
  }

  if (pathname === '/routes') {
    return copy.navigation.routes
  }

  if (pathname === '/ai') {
    return copy.navigation.ai
  }

  return copy.infoPages[staticPageIdMap[pathname]].eyebrow
}

function buildBreadcrumbData({
  pathname,
  language,
  copy,
  pageUrl,
}: {
  pathname: PublicSeoPath
  language: Language
  copy: SiteLanguageContent
  pageUrl: string
}) {
  const homeUrl = buildPublicUrl('/', language)
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: copy.navigation.discover,
      item: homeUrl,
    },
  ]

  if (pathname !== '/') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: getPageLabel(pathname, copy),
      item: pageUrl,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

function buildRouteSpecificStructuredData({
  pathname,
  language,
  copy,
  pageUrl,
}: {
  pathname: PublicSeoPath
  language: Language
  copy: SiteLanguageContent
  pageUrl: string
}) {
  if (pathname === '/faq') {
    const faqContent = copy.infoPages.faq

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqContent.items.map((item) => ({
        '@type': 'Question',
        name: item.title,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.description,
        },
      })),
    }
  }

  if (pathname === '/places') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: copy.places.map((place, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'TouristAttraction',
          name: place.title,
          description: place.description,
          image: place.image,
        },
      })),
    }
  }

  if (pathname === '/routes') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: copy.routes.map((route, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Trip',
          name: route.title,
          description: route.description,
          itinerary: route.stops.join(', '),
        },
      })),
    }
  }

  if (pathname === '/contact') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      url: pageUrl,
      name: getPageHeading(pathname, language, copy),
    }
  }

  if (pathname === '/about') {
    return {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      url: pageUrl,
      name: getPageHeading(pathname, language, copy),
    }
  }

  return null
}

export function buildPublicSeo({ pathname, language, copy }: BuildPublicSeoInput): SeoConfig {
  const normalizedPath = normalizePath(pathname)
  const baseUrl = getSiteBaseUrl()
  const canonical = buildPublicUrl(normalizedPath, language)
  const image = `${baseUrl}/icons/icon-512-maskable.png`
  const title = `${getPageHeading(normalizedPath, language, copy)} | ${copy.brand}`
  const description = getPageDescription(normalizedPath, language, copy)
  const organizationId = `${baseUrl}#organization`
  const websiteId = `${baseUrl}#website`
  const webpageId = `${canonical}#webpage`
  const alternates: SeoAlternate[] = [
    ...(['hy', 'en', 'ru'] as Language[]).map((targetLanguage) => ({
      hrefLang: targetLanguage,
      href: buildPublicUrl(normalizedPath, targetLanguage),
    })),
    {
      hrefLang: 'x-default',
      href: buildPathUrl(normalizedPath),
    },
  ]
  const pageSpecificStructuredData = buildRouteSpecificStructuredData({
    pathname: normalizedPath,
    language,
    copy,
    pageUrl: canonical,
  })

  const structuredData: StructuredDataNode[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': organizationId,
      name: copy.brand,
      url: baseUrl,
      logo: image,
      email: 'info@jermuktravel.am',
      telephone: '+37400000000',
      address: {
        '@type': 'PostalAddress',
        addressLocality: cityNameMap[language],
        addressCountry: 'AM',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': websiteId,
      url: baseUrl,
      name: copy.brand,
      inLanguage: localeMap[language],
      publisher: {
        '@id': organizationId,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': getWebPageType(normalizedPath),
      '@id': webpageId,
      url: canonical,
      name: title,
      description,
      inLanguage: localeMap[language],
      isPartOf: {
        '@id': websiteId,
      },
      about: {
        '@type': 'TouristDestination',
        name: cityNameMap[language],
      },
    },
    buildBreadcrumbData({
      pathname: normalizedPath,
      language,
      copy,
      pageUrl: canonical,
    }),
  ]

  if (pageSpecificStructuredData) {
    structuredData.push(pageSpecificStructuredData)
  }

  if (normalizedPath === '/') {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'TouristDestination',
      name: cityNameMap[language],
      description: copy.hero.subtitle,
      url: canonical,
      touristType:
        language === 'hy'
          ? ['Բնություն', 'Բուժիչ ջուր', 'Հանգիստ']
          : language === 'ru'
            ? ['Природа', 'Минеральная вода', 'Отдых']
            : ['Nature', 'Mineral water', 'Rest'],
    })
  }

  return {
    title,
    description,
    keywords: routeKeywordMap[language][normalizedPath],
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    canonical,
    alternates,
    ogType: 'website',
    locale: ogLocaleMap[language],
    localeAlternates: (['hy', 'en', 'ru'] as Language[])
      .filter((targetLanguage) => targetLanguage !== language)
      .map((targetLanguage) => ogLocaleMap[targetLanguage]),
    image,
    imageAlt: `${copy.brand} logo`,
    structuredData,
  }
}

function upsertMeta({
  selector,
  attribute,
  key,
  content,
}: {
  selector: string
  attribute: 'name' | 'property'
  key: string
  content: string
}) {
  let node = document.head.querySelector(selector) as HTMLMetaElement | null

  if (!node) {
    node = document.createElement('meta')
    node.setAttribute(attribute, key)
    document.head.appendChild(node)
  }

  node.content = content
}

function upsertLink({
  selector,
  rel,
  href,
  hreflang,
}: {
  selector: string
  rel: string
  href: string
  hreflang?: string
}) {
  let node = document.head.querySelector(selector) as HTMLLinkElement | null

  if (!node) {
    node = document.createElement('link')
    node.rel = rel
    document.head.appendChild(node)
  }

  node.href = href

  if (hreflang) {
    node.hreflang = hreflang
  }
}

function removeHeadNodes(selector: string) {
  document.head.querySelectorAll(selector).forEach((node) => node.remove())
}

export function useSeo(config: SeoConfig) {
  useEffect(() => {
    document.title = config.title
    document.documentElement.lang = config.locale?.replace('_', '-') ?? 'hy-AM'

    upsertMeta({
      selector: 'meta[name="description"]',
      attribute: 'name',
      key: 'description',
      content: config.description,
    })
    upsertMeta({
      selector: 'meta[name="keywords"]',
      attribute: 'name',
      key: 'keywords',
      content: config.keywords?.join(', ') ?? '',
    })
    upsertMeta({
      selector: 'meta[name="robots"]',
      attribute: 'name',
      key: 'robots',
      content: config.robots ?? 'index,follow',
    })
    upsertMeta({
      selector: 'meta[name="googlebot"]',
      attribute: 'name',
      key: 'googlebot',
      content: config.robots ?? 'index,follow',
    })
    upsertMeta({
      selector: 'meta[name="author"]',
      attribute: 'name',
      key: 'author',
      content: siteName,
    })
    upsertMeta({
      selector: 'meta[name="application-name"]',
      attribute: 'name',
      key: 'application-name',
      content: siteName,
    })
    upsertMeta({
      selector: 'meta[property="og:title"]',
      attribute: 'property',
      key: 'og:title',
      content: config.title,
    })
    upsertMeta({
      selector: 'meta[property="og:description"]',
      attribute: 'property',
      key: 'og:description',
      content: config.description,
    })
    upsertMeta({
      selector: 'meta[property="og:type"]',
      attribute: 'property',
      key: 'og:type',
      content: config.ogType ?? 'website',
    })
    upsertMeta({
      selector: 'meta[property="og:site_name"]',
      attribute: 'property',
      key: 'og:site_name',
      content: siteName,
    })

    if (config.locale) {
      upsertMeta({
        selector: 'meta[property="og:locale"]',
        attribute: 'property',
        key: 'og:locale',
        content: config.locale,
      })
    }

    if (config.canonical) {
      upsertMeta({
        selector: 'meta[property="og:url"]',
        attribute: 'property',
        key: 'og:url',
        content: config.canonical,
      })
      upsertLink({
        selector: 'link[rel="canonical"]',
        rel: 'canonical',
        href: config.canonical,
      })
    }

    if (config.image) {
      upsertMeta({
        selector: 'meta[property="og:image"]',
        attribute: 'property',
        key: 'og:image',
        content: config.image,
      })
      upsertMeta({
        selector: 'meta[name="twitter:image"]',
        attribute: 'name',
        key: 'twitter:image',
        content: config.image,
      })
    }

    if (config.imageAlt) {
      upsertMeta({
        selector: 'meta[property="og:image:alt"]',
        attribute: 'property',
        key: 'og:image:alt',
        content: config.imageAlt,
      })
      upsertMeta({
        selector: 'meta[name="twitter:image:alt"]',
        attribute: 'name',
        key: 'twitter:image:alt',
        content: config.imageAlt,
      })
    }

    upsertMeta({
      selector: 'meta[name="twitter:card"]',
      attribute: 'name',
      key: 'twitter:card',
      content: 'summary_large_image',
    })
    upsertMeta({
      selector: 'meta[name="twitter:title"]',
      attribute: 'name',
      key: 'twitter:title',
      content: config.title,
    })
    upsertMeta({
      selector: 'meta[name="twitter:description"]',
      attribute: 'name',
      key: 'twitter:description',
      content: config.description,
    })

    removeHeadNodes('link[data-seo-alternate="true"]')
    config.alternates?.forEach((alternate) => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.href = alternate.href
      link.hreflang = alternate.hrefLang
      link.setAttribute('data-seo-alternate', 'true')
      document.head.appendChild(link)
    })

    removeHeadNodes('meta[data-seo-locale-alt="true"]')
    config.localeAlternates?.forEach((locale) => {
      const node = document.createElement('meta')
      node.setAttribute('property', 'og:locale:alternate')
      node.content = locale
      node.setAttribute('data-seo-locale-alt', 'true')
      document.head.appendChild(node)
    })

    removeHeadNodes('script[data-seo-structured="true"]')

    if (config.structuredData?.length) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(config.structuredData)
      script.setAttribute('data-seo-structured', 'true')
      document.head.appendChild(script)
    }
  }, [config])
}

export function buildAdminSeo(title: string, description: string): SeoConfig {
  const baseUrl = getSiteBaseUrl()
  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `${baseUrl}/admin`

  return {
    title,
    description,
    robots: 'noindex,nofollow,noarchive',
    canonical: currentUrl,
    ogType: 'website',
    locale: ogLocaleMap.hy,
    image: `${baseUrl}/icons/icon-512-maskable.png`,
    imageAlt: `${siteName} logo`,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description,
        url: currentUrl,
      },
    ],
  }
}
