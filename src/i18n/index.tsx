'use client'

import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react'
import { en } from './en'
import { nl } from './nl'
import { fr } from './fr'
import { de } from './de'

export type Language = 'en' | 'nl' | 'fr' | 'de'
type Translations = typeof en

const STORAGE_KEY = 'cohousing-language'
const SUPPORTED_LANGUAGES: Language[] = ['en', 'nl', 'fr', 'de']
const DEFAULT_LANGUAGE: Language = 'nl'

const translations: Record<Language, Translations> = {
  en,
  nl,
  fr,
  de,
}

/**
 * Type guard for supported languages
 */
function isSupportedLanguage(lang: string | null | undefined): lang is Language {
  return typeof lang === 'string' && SUPPORTED_LANGUAGES.includes(lang as Language)
}

/**
 * Get the initial language preference
 * Priority: localStorage > browser preference > default (nl)
 */
function getInitialLanguage(): Language {
  // Only run on client
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }

  // 1. Check localStorage (with error handling for private browsing)
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isSupportedLanguage(stored)) {
      return stored
    }
  } catch {
    // localStorage unavailable (private browsing, quota exceeded, etc.)
  }

  // 2. Check browser preference (with null safety)
  const browserLang = navigator?.language?.split('-')[0]
  if (isSupportedLanguage(browserLang)) {
    return browserLang
  }

  // 3. Default to Dutch
  return DEFAULT_LANGUAGE
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize language from storage/browser on mount
  useEffect(() => {
    const initialLang = getInitialLanguage()
    setLanguageState(initialLang)
    setIsHydrated(true)
  }, [])

  // Update HTML lang attribute when language changes
  useEffect(() => {
    if (isHydrated) {
      document.documentElement.lang = language
    }
  }, [language, isHydrated])

  // Persist language to localStorage (memoized)
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Silently fail if localStorage unavailable
    }
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    language,
    setLanguage,
    t: translations[language],
  }), [language, setLanguage])

  return (
    <I18nContext.Provider value={value}>
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
