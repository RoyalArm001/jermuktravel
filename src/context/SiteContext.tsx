import { useState, type ReactNode } from 'react'
import { defaultSiteContent } from '../content/defaultContent'
import { deepClone, loadLanguage, loadSiteContent, resetStoredSiteContent, saveLanguage, saveSiteContent } from '../lib/storage'
import { SiteContext } from './site-context'
import type { Language, SiteContent, SiteLanguageContent } from '../types'

export function SiteProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => loadSiteContent())
  const [language, setLanguageState] = useState<Language>(() => loadLanguage())

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
    saveLanguage(nextLanguage)
  }

  const replaceLanguageContent = (targetLanguage: Language, nextContent: SiteLanguageContent) => {
    setContent((previousContent) => {
      const updatedContent = {
        ...previousContent,
        [targetLanguage]: nextContent,
      }

      saveSiteContent(updatedContent)
      return updatedContent
    })
  }

  const resetContent = () => {
    const resetValue = deepClone(defaultSiteContent)
    setContent(resetValue)
    resetStoredSiteContent()
  }

  return (
    <SiteContext.Provider
      value={{
        content,
        language,
        setLanguage,
        replaceLanguageContent,
        resetContent,
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}
