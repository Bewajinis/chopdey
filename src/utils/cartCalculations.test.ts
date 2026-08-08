import { describe, expect, it } from 'vitest'
import { calculateTotals } from './cartCalculations'
import type { CartItem, Venue, Zone } from '../types'

const venue: Venue = {
  id: 'test-buka',
  name: 'Test Buka',
  type: 'buka',
  zoneId: 'yaba',
  lat: 6.5095,
  lng: 3.3711,
  imageUrl: '',
  openingHour: 8,
  closingHour: 22,
  packFee: 300,
  menu: [],
}

const zone: Zone = {
  id: 'yaba',
  name: 'Yaba',
  centerLat: 6.5095,
  centerLng: 3.3711,
  deliveryFee: 500,
  estimatedDeliveryMinutes: '20-35',
}

const items: CartItem[] = [
  {
    id: 'jollof',
    name: 'Jollof Rice',
    category: 'Rice',
    price: 2500,
    availableFrom: 8,
    availableUntil: 22,
    quantity: 2,
    venueId: 'test-buka',
  },
  {
    id: 'chicken',
    name: 'Grilled Chicken',
    category: 'Protein',
    price: 1800,
    availableFrom: 8,
    availableUntil: 22,
    quantity: 1,
    venueId: 'test-buka',
  },
]

describe('calculateTotals', () => {
  it('calculates subtotal, fees, service charge, and total', () => {
    const totals = calculateTotals(items, venue, zone)

    expect(totals.subtotal).toBe(6800)
    expect(totals.packFee).toBe(300)
    expect(totals.deliveryFee).toBe(500)
    expect(totals.serviceCharge).toBe(340)
    expect(totals.total).toBe(7940)
  })
})
