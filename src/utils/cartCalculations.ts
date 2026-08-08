import type { CartItem, Venue, Zone } from '../types'

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export interface CartTotals {
  subtotal: number
  packFee: number
  deliveryFee: number
  serviceCharge: number
  total: number
}

export function calculateTotals(
  items: CartItem[],
  venue: Venue,
  zone: Zone,
): CartTotals {
  const subtotal = calculateSubtotal(items)
  const packFee = venue.packFee
  const deliveryFee = zone.deliveryFee
  const serviceCharge = Math.round(subtotal * 0.05)
  const total = subtotal + packFee + deliveryFee + serviceCharge

  return { subtotal, packFee, deliveryFee, serviceCharge, total }
}
