export type Language = 'hy' | 'en' | 'ru'

export type DirectoryCategoryId =
  | 'stay'
  | 'food'
  | 'leisure'
  | 'tours'
  | 'sights'
  | 'essentials'
  | 'shops'
  | 'services'
  | 'auto'

export type MorePageId =
  | 'help'
  | 'faq'
  | 'about'
  | 'contact'
  | 'terms'
  | 'privacy'

export interface Metric {
  label: string
  value: string
}

export interface GuideCard {
  id: string
  title: string
  description: string
}

export interface SpotlightCard {
  id: string
  title: string
  description: string
  detail: string
  tag: string
  image: string
}

export interface RouteCard {
  id: string
  title: string
  description: string
  duration: string
  season: string
  stops: string[]
}

export interface HeroContent {
  eyebrow: string
  title: string
  subtitle: string
  primaryAction: string
  secondaryAction: string
  metrics: Metric[]
}

export interface SectionIntro {
  eyebrow: string
  title: string
  description: string
}

export interface AIConfig {
  title: string
  description: string
  placeholder: string
  prompts: string[]
  welcome: string
}

export interface FooterContent {
  tagline: string
  subline: string
  exploreLabel: string
  adminLabel: string
}

export interface DirectoryMenuItem {
  id: DirectoryCategoryId
  label: string
  description: string
  to: string
}

export interface DirectoryMenuContent {
  kicker: string
  title: string
  utilityLabel: string
  items: DirectoryMenuItem[]
}

export interface MorePageItem {
  title: string
  description: string
}

export interface MorePageContent {
  eyebrow: string
  title: string
  description: string
  sideTitle: string
  sideDescription: string
  highlights: string[]
  items: MorePageItem[]
}

export interface SiteLanguageContent {
  brand: string
  cityLine: string
  navigation: {
    discover: string
    places: string
    routes: string
    ai: string
    more: string
    help: string
    faq: string
    about: string
    contact: string
    admin: string
  }
  directoryMenu: DirectoryMenuContent
  hero: HeroContent
  overview: SectionIntro & {
    cards: GuideCard[]
  }
  placesSection: SectionIntro
  places: SpotlightCard[]
  routesSection: SectionIntro
  routes: RouteCard[]
  aiSection: SectionIntro
  ai: AIConfig
  infoPages: Record<MorePageId, MorePageContent>
  footer: FooterContent
}

export type SiteContent = Record<Language, SiteLanguageContent>
