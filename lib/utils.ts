import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  return phone
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  // Fixed regex - removed problematic lookbehind
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  const cleaned = phone.replace(/\D/g, "")
  return cleaned.length >= 10 && cleaned.length <= 15
}

export function validateZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zipCode)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function calculateAge(birthDate: Date, deathDate?: Date): number {
  const endDate = deathDate || new Date()
  const age = endDate.getFullYear() - birthDate.getFullYear()
  const monthDiff = endDate.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
    return age - 1
  }

  return age
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Generates a unique order ID for Square payments
 * @param prefix - Optional prefix for the order ID (default: "ORD")
 * @returns A compact, unique order ID (e.g., "ORDMHNZQD8FDMT0R")
 * @remarks 
 * - The generated ID is guaranteed to be under 40 characters to comply with Square's reference_id field limit
 * - This is a temporary ID used only for the payment transaction; the actual order number is generated server-side
 * - Uses timestamp + random component for uniqueness; crypto randomness not required for this temporary ID
 * @throws Error if the generated ID exceeds 40 characters
 */
export function generateOrderId(prefix: string = "ORD"): string {
  // Validate prefix length to ensure final ID stays under 40 chars
  // As of 2025, timestamp in base-36 is 8 chars and grows slowly (~1 char per 36^n milliseconds)
  // Random component: 5 chars, total suffix: ~13 chars currently, max ~16 chars in distant future
  // To stay under 40 chars safely: prefix must be <= 24 chars (24 + 16 = 40)
  if (prefix.length > 24) {
    throw new Error("Order ID prefix is too long. Maximum prefix length is 24 characters.")
  }

  const timestamp = Date.now().toString(36).toUpperCase()
  // Note: Math.random() provides sufficient uniqueness for temporary order IDs
  // The timestamp already ensures uniqueness across time; random is for additional collision avoidance
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  const orderId = `${prefix}${timestamp}${random}`

  // Safety check to ensure we're under Square's 40 character limit
  if (orderId.length > 40) {
    throw new Error(`Generated order ID exceeds 40 characters: ${orderId.length}`)
  }

  return orderId
}
