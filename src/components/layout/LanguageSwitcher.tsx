'use client'

import { useTranslation } from '@/i18n'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const languages = [
  { code: 'nl' as const, flag: '🇳🇱', name: 'Nederlands' },
  { code: 'en' as const, flag: '🇬🇧', name: 'English' },
  { code: 'fr' as const, flag: '🇫🇷', name: 'Français' },
  { code: 'de' as const, flag: '🇩🇪', name: 'Deutsch' },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="text-xl" role="img" aria-label={currentLanguage.name}>
            {currentLanguage.flag}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? 'secondary' : 'ghost'}
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => setLanguage(lang.code)}
            >
              <span className="text-lg" role="img" aria-label={lang.name}>
                {lang.flag}
              </span>
              <span className="text-sm">{lang.name}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
