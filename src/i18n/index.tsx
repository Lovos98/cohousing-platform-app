'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { en } from './en'
import { nl } from './nl'
import { fr } from './fr'
import { de } from './de'

type Language = 'en' | 'nl' | 'fr' | 'de'
type Translations = typeof en

const translations: Record<Language, Translations> = {
  en,
  nl,
  fr,
  de,
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('nl') // Default to Dutch

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider')
  }
  return context
}
