import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price in BRL currency
 */
export function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

/**
 * Creates a debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout

  return ((...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

/**
 * Formats a date string based on locale
 */
export function formatDate(date: Date, locale = 'pt-BR') {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Capitalizes first letter of each word in a string
 */
export function capitalizeWords(str: string) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Validates an email address
 */
export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Truncates a string to a maximum length
 */
export function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Gets relative time string (e.g. "2 hours ago")
 */
export function getRelativeTimeString(date: Date, locale = 'pt-BR') {
  const formatter = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
  })

  const now = new Date()
  const diff = date.getTime() - now.getTime()

  const diffInDays = Math.round(diff / (1000 * 60 * 60 * 24))
  const diffInHours = Math.round(diff / (1000 * 60 * 60))
  const diffInMinutes = Math.round(diff / (1000 * 60))

  if (Math.abs(diffInDays) >= 1) {
    return formatter.format(diffInDays, 'day')
  }
  if (Math.abs(diffInHours) >= 1) {
    return formatter.format(diffInHours, 'hour')
  }
  return formatter.format(diffInMinutes, 'minute')
}
