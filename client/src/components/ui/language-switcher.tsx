"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/hooks/use-language'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

interface LanguageSwitcherProps {
  className?: string
}

const languages = {
  'pt-BR': {
    name: 'Português',
    flag: '🇧🇷'
  },
  'en-US': {
    name: 'English',
    flag: '🇺🇸'
  },
  'es-ES': {
    name: 'Español',
    flag: '🇪🇸'
  }
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage()
  const currentLanguage = languages[language] || languages['pt-BR']

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-2 hover:bg-river-slate-50",
            className
          )}
        >
          <Globe className="h-4 w-4 text-sunset-amber-600" />
          <span className="hidden md:inline-block">
            {currentLanguage.flag} {currentLanguage.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {Object.entries(languages).map(([code, lang]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code as keyof typeof languages)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              language === code && "bg-river-slate-50"
            )}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
            {language === code && (
              <span className="flex-1 text-right text-sunset-amber-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
