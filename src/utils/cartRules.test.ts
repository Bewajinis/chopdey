import { describe, expect, it } from 'vitest'
import { checkCanAddItem } from './cartRules'
import type { Venue } from '../types'

const venueA: Venue = {
  id: 'buka-a',
  name: 'Buka A',
  type: 'buka',
  zoneId: 'yaba',
  lat: 6.5,
  lng: 3.37,
  imageUrl: '',
  openingHour: 8,
  closingHour: 22,
  packFee: 300,
  menu: [],
}

const venueB: Venue = {
  ...venueA,
  id: 'buka-b',
  name: 'Buka B',
}

describe('checkCanAddItem', () => {
  it('allows adding when the cart is empty', () => {
    expect(checkCanAddItem(null, venueA)).toEqual({ ok: true })
  })

  it('allows adding from the same venue', () => {
    expect(checkCanAddItem(venueA, venueA)).toEqual({ ok: true })
  })

  it('blocks adding from a different venue', () => {
    expect(checkCanAddItem(venueA, venueB)).toEqual({
      ok: false,
      reason: 'different-venue',
      currentVenueName: 'Buka A',
    })
  })
})
