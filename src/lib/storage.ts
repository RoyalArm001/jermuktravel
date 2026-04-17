import { defaultSiteContent } from '../content/defaultContent'
import type { Language, MorePageId, SiteContent, SiteLanguageContent } from '../types'

const contentStorageKey = 'jermuk-travel.cms.v2'
const languageStorageKey = 'jermuk-travel.lang.v2'

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function normalizeCmsText(value: string) {
  return value.replace(/\s+/g, ' ').trim().toLocaleLowerCase()
}

const legacyHeroCopyMap = {
  hy: {
    legacyTitles: [
      'Բացահայտիր Ջերմուկը հանգստի, բնության ու բուժիչ ջրի նոր ռիթմով',
      'Բացահայտիր Ջերմուկը',
    ],
    nextTitle: 'Բարի գալուստ Ջերմուկ',
    legacySubtitles: [
      'Գեղեցիկ, պարզ և կենդանի կայք, որտեղ մարդիկ արագ հասկանում են քաղաքում ինչ տեսնել, ուր գնալ և ինչպես պլանավորել իրենց օրերը։',
      'Բնություն, բուժիչ ջուր, հանգիստ։',
    ],
    nextSubtitle: 'Հրաշալի բնություն, բուժիչ ջուր և խաղաղ հանգիստ։',
  },
  en: {
    legacyTitles: [
      'Discover Jermuk through wellness, nature, and a calmer travel rhythm',
      'Discover Jermuk',
    ],
    nextTitle: 'Welcome to Jermuk',
    legacySubtitles: [
      'A clean, animated city guide that helps visitors instantly understand what exists in Jermuk, where to go, and how to plan a smooth stay.',
      'Nature, mineral water, and calm rest.',
    ],
    nextSubtitle: 'Beautiful nature, mineral water, and a calm rhythm of rest.',
  },
  ru: {
    legacyTitles: [
      'Откройте Джермук через природу, отдых и ритм спокойного путешествия',
      'Откройте Джермук',
    ],
    nextTitle: 'Добро пожаловать в Джермук',
    legacySubtitles: [
      'Чистый и красивый городской сайт с анимацией, который помогает людям быстро понять, что есть в Джермуке и как спланировать поездку.',
      'Природа, минеральная вода и отдых.',
    ],
    nextSubtitle: 'Красивая природа, минеральная вода и спокойный отдых.',
  },
} satisfies Record<
  Language,
  {
    legacyTitles: string[]
    nextTitle: string
    legacySubtitles: string[]
    nextSubtitle: string
  }
>

function matchesLegacyCopy(value: string, legacyValues: string[], looseMatch: RegExp) {
  const normalizedValue = normalizeCmsText(value)

  return (
    legacyValues.some((legacyValue) => normalizeCmsText(legacyValue) === normalizedValue) ||
    looseMatch.test(normalizedValue)
  )
}

function migrateLegacyHeroCopy(content: SiteContent): SiteContent {
  const nextContent = deepClone(content)

  ;(['hy', 'en', 'ru'] as Language[]).forEach((language) => {
    const copy = legacyHeroCopyMap[language]
    const hero = nextContent[language].hero
    const titleMatcher =
      language === 'hy'
        ? /բացահայտիր\s+ջերմուկ/
        : language === 'ru'
          ? /откройте\s+джермук/
          : /discover\s+jermuk/
    const subtitleMatcher =
      language === 'hy'
        ? /(բնություն|բուժիչ ջուր|հանգիստ)/
        : language === 'ru'
          ? /(природа|минеральная вода|отдых)/
          : /(nature|mineral water|calm rest)/

    if (matchesLegacyCopy(hero.title, copy.legacyTitles, titleMatcher)) {
      hero.title = copy.nextTitle
    }

    if (matchesLegacyCopy(hero.subtitle, copy.legacySubtitles, subtitleMatcher)) {
      hero.subtitle = copy.nextSubtitle
    }
  })

  return nextContent
}

export function isLanguage(value: unknown): value is Language {
  return value === 'hy' || value === 'en' || value === 'ru'
}

function mergeLanguageContent(
  fallbackContent: SiteLanguageContent,
  rawContent?: Partial<SiteLanguageContent>,
) {
  if (!rawContent) {
    return deepClone(fallbackContent)
  }

  const infoPageIds = ['help', 'faq', 'about', 'contact', 'terms', 'privacy'] as const satisfies MorePageId[]

  const mergeInfoPageContent = (
    fallbackPage: SiteLanguageContent['infoPages'][MorePageId],
    rawPage?: Partial<SiteLanguageContent['infoPages'][MorePageId]>,
  ) => ({
    ...deepClone(fallbackPage),
    ...rawPage,
    highlights: rawPage?.highlights
      ? [...rawPage.highlights]
      : [...fallbackPage.highlights],
    items: rawPage?.items
      ? rawPage.items.map((item, index) => ({
          ...(fallbackPage.items[index] ?? { title: '', description: '' }),
          ...item,
        }))
      : deepClone(fallbackPage.items),
  })

  const mergeInfoPages = () =>
    infoPageIds.reduce((pages, pageId) => {
      pages[pageId] = mergeInfoPageContent(
        fallbackContent.infoPages[pageId],
        rawContent.infoPages?.[pageId],
      )
      return pages
    }, {} as SiteLanguageContent['infoPages'])

  const mergeDirectoryMenu = () => ({
    ...deepClone(fallbackContent.directoryMenu),
    ...rawContent.directoryMenu,
    items: fallbackContent.directoryMenu.items.map((item, index) => ({
      ...item,
      ...(rawContent.directoryMenu?.items?.[index] ?? {}),
    })),
  })

  return {
    ...deepClone(fallbackContent),
    ...rawContent,
    navigation: {
      ...deepClone(fallbackContent.navigation),
      ...rawContent.navigation,
    },
    hero: {
      ...deepClone(fallbackContent.hero),
      ...rawContent.hero,
    },
    overview: {
      ...deepClone(fallbackContent.overview),
      ...rawContent.overview,
    },
    placesSection: {
      ...deepClone(fallbackContent.placesSection),
      ...rawContent.placesSection,
    },
    routesSection: {
      ...deepClone(fallbackContent.routesSection),
      ...rawContent.routesSection,
    },
    aiSection: {
      ...deepClone(fallbackContent.aiSection),
      ...rawContent.aiSection,
    },
    ai: {
      ...deepClone(fallbackContent.ai),
      ...rawContent.ai,
    },
    directoryMenu: mergeDirectoryMenu(),
    infoPages: mergeInfoPages(),
    footer: {
      ...deepClone(fallbackContent.footer),
      ...rawContent.footer,
    },
  }
}

export function loadSiteContent(): SiteContent {
  if (typeof window === 'undefined') {
    return migrateLegacyHeroCopy(deepClone(defaultSiteContent))
  }

  try {
    const raw = window.localStorage.getItem(contentStorageKey)

    if (!raw) {
      return migrateLegacyHeroCopy(deepClone(defaultSiteContent))
    }

    const parsed = JSON.parse(raw) as Partial<SiteContent>

    return migrateLegacyHeroCopy({
      hy: mergeLanguageContent(defaultSiteContent.hy, parsed.hy),
      en: mergeLanguageContent(defaultSiteContent.en, parsed.en),
      ru: mergeLanguageContent(defaultSiteContent.ru, parsed.ru),
    })
  } catch {
    return migrateLegacyHeroCopy(deepClone(defaultSiteContent))
  }
}

export function saveSiteContent(content: SiteContent) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(contentStorageKey, JSON.stringify(content))
}

export function resetStoredSiteContent() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(contentStorageKey)
}

export function loadLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'hy'
  }

  const urlLanguage = new URLSearchParams(window.location.search).get('lang')

  if (isLanguage(urlLanguage)) {
    return urlLanguage
  }

  const storedLanguage = window.localStorage.getItem(languageStorageKey)
  return isLanguage(storedLanguage) ? storedLanguage : 'hy'
}

export function saveLanguage(language: Language) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(languageStorageKey, language)
}
