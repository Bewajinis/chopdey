import { describe, expect, it } from 'vitest'
import { isMenuItemAvailable, isVenueOpen } from './availability'
import type { MenuItem, Venue } from '../types'

const venue: Venue = {
  id: 'test-venue',
  name: 'Test Venue',
  type: 'restaurant',
  zoneId: 'yaba',
  lat: 6.5,
  lng: 3.37,
  imageUrl: '',
  openingHour: 9,
  closingHour: 21,
  packFee: 300,
  menu: [],
}

const menuItem: MenuItem = {
  id: 'item-1',
  name: 'Jollof',
  category: 'Rice',
  price: 2000,
  availableFrom: 11,
  availableUntil: 20,
}

function atHour(hour: number): Date {
  const date = new Date('2026-08-08T00:00:00')
  date.setHours(hour, 30, 0, 0)
  return date
}

describe('isVenueOpen', () => {
  it('returns true during opening hours', () => {
    expect(isVenueOpen(venue, atHour(12))).toBe(true)
  })

  it('returns false before opening', () => {
    expect(isVenueOpen(venue, atHour(8))).toBe(false)
  })

  it('returns false at closing hour', () => {
    expect(isVenueOpen(venue, atHour(21))).toBe(false)
  })
})

describe('isMenuItemAvailable', () => {
  it('returns true within availability window', () => {
    expect(isMenuItemAvailable(menuItem, atHour(15))).toBe(true)
  })

  it('returns false before availableFrom', () => {
    expect(isMenuItemAvailable(menuItem, atHour(10))).toBe(false)
  })

  it('returns false at availableUntil boundary', () => {
    expect(isMenuItemAvailable(menuItem, atHour(20))).toBe(false)
  })
})
