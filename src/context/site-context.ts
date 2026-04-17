import { createContext } from 'react'
import type { Language, SiteContent, SiteLanguageContent } from '../types'

export interface SiteContextValue {
  content: SiteContent
  language: Language
  setLanguage: (language: Language) => void
  replaceLanguageContent: (language: Language, nextContent: SiteLanguageContent) => void
  resetContent: () => void
}

export const SiteContext = createContext<SiteContextValue | null>(null)
