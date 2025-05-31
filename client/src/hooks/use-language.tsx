"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type Language = 'pt-BR' | 'en-US' | 'es-ES'

interface TranslationKey {
  'booking.select': string
  'booking.selected': string
  'booking.startSelected': string
  'booking.selectPeriod': string
  'booking.selectStartDate': string
  'booking.selectEndDate': string
  'booking.errors.minNights': string
  'booking.errors.maxNights': string
  'booking.errors.generic': string
  'booking.guest': string
  'booking.guests': string
  'booking.reserveNow': string
  'booking.nightsLimit': string
  'booking.selectedDays': string
  'booking.calendar': string
  'booking.unavailableDates': string
  'booking.stayLimits': string
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof TranslationKey) => string
}

const translations: Record<Language, TranslationKey> = {
  'pt-BR': {
    'booking.select': 'Selecione um período',
    'booking.selected': 'Período selecionado',
    'booking.startSelected': 'Data inicial selecionada',
    'booking.selectPeriod': 'Selecionar período',
    'booking.selectStartDate': 'Selecione a data inicial',
    'booking.selectEndDate': 'Selecione a data final',
    'booking.errors.minNights': 'Mínimo de noites não atingido',
    'booking.errors.maxNights': 'Máximo de noites excedido',
    'booking.errors.generic': 'Ocorreu um erro',
    'booking.guest': 'hóspede',
    'booking.guests': 'hóspedes',
    'booking.reserveNow': 'Reservar agora',
    'booking.nightsLimit': 'Limite de noites',
    'booking.selectedDays': 'período selecionado',
    'booking.calendar': 'Calendário para seleção de período',
    'booking.unavailableDates': 'Algumas datas não estão disponíveis',
    'booking.stayLimits': 'Limite de estadia'
  },
  'en-US': {
    'booking.select': 'Select a period',
    'booking.selected': 'Selected period',
    'booking.startSelected': 'Start date selected',
    'booking.selectPeriod': 'Select period',
    'booking.selectStartDate': 'Select start date',
    'booking.selectEndDate': 'Select end date',
    'booking.errors.minNights': 'Minimum nights not reached',
    'booking.errors.maxNights': 'Maximum nights exceeded',
    'booking.errors.generic': 'An error occurred',
    'booking.guest': 'guest',
    'booking.guests': 'guests',
    'booking.reserveNow': 'Book now',
    'booking.nightsLimit': 'Nights limit',
    'booking.selectedDays': 'selected period',
    'booking.calendar': 'Calendar for period selection',
    'booking.unavailableDates': 'Some dates are unavailable',
    'booking.stayLimits': 'Stay limits'
  },
  'es-ES': {
    'booking.select': 'Seleccione un período',
    'booking.selected': 'Período seleccionado',
    'booking.startSelected': 'Fecha inicial seleccionada',
    'booking.selectPeriod': 'Seleccionar período',
    'booking.selectStartDate': 'Seleccione la fecha inicial',
    'booking.selectEndDate': 'Seleccione la fecha final',
    'booking.errors.minNights': 'Mínimo de noches no alcanzado',
    'booking.errors.maxNights': 'Máximo de noches excedido',
    'booking.errors.generic': 'Ocurrió un error',
    'booking.guest': 'huésped',
    'booking.guests': 'huéspedes',
    'booking.reserveNow': 'Reservar ahora',
    'booking.nightsLimit': 'Límite de noches',
    'booking.selectedDays': 'período seleccionado',
    'booking.calendar': 'Calendario para selección de período',
    'booking.unavailableDates': 'Algunas fechas no están disponibles',
    'booking.stayLimits': 'Límites de estadía'
  }
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'pt-BR'

    // Try to get from localStorage
    const saved = localStorage.getItem('language')
    if (saved && Object.keys(translations).includes(saved)) {
      return saved as Language
    }
    
    // Try to get from browser
    const browserLang = navigator.language
    if (browserLang.startsWith('pt')) return 'pt-BR'
    if (browserLang.startsWith('es')) return 'es-ES'
    return 'en-US'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang)
  }

  const t = (key: keyof TranslationKey): string => {
    const currentTranslations = translations[language] || translations['pt-BR']
    return currentTranslations[key]
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
