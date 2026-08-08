const CART_STORAGE_KEY = 'chopdey-cart'

export function isValidNigerianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')

  if (digits.startsWith('234') && digits.length === 13) {
    return /^234[789]\d{9}$/.test(digits)
  }

  if (digits.startsWith('0') && digits.length === 11) {
    return /^0[789]\d{9}$/.test(digits)
  }

  if (digits.length === 10) {
    return /^[789]\d{9}$/.test(digits)
  }

  return false
}

export function normalizeNigerianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')

  if (digits.startsWith('234') && digits.length === 13) {
    return `0${digits.slice(3)}`
  }

  if (digits.length === 10) {
    return `0${digits}`
  }

  return digits
}

export function validateDeliveryAddress(address: string): string | null {
  const trimmed = address.trim()

  if (!trimmed) {
    return 'Delivery address is required.'
  }

  if (trimmed.length < 5) {
    return 'Please enter a more detailed delivery address.'
  }

  return null
}

export { CART_STORAGE_KEY }
