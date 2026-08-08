import { describe, expect, it } from 'vitest'
import { getDistanceKm, findNearestZone } from './locationService'
import type { Zone } from '../types'

const zones: Zone[] = [
  {
    id: 'yaba',
    name: 'Yaba',
    centerLat: 6.5095,
    centerLng: 3.3711,
    deliveryFee: 500,
    estimatedDeliveryMinutes: '20-35',
  },
  {
    id: 'surulere',
    name: 'Surulere',
    centerLat: 6.4926,
    centerLng: 3.3549,
    deliveryFee: 600,
    estimatedDeliveryMinutes: '25-40',
  },
  {
    id: 'ikeja',
    name: 'Ikeja',
    centerLat: 6.6018,
    centerLng: 3.3515,
    deliveryFee: 700,
    estimatedDeliveryMinutes: '25-45',
  },
]

describe('getDistanceKm', () => {
  it('returns 0 for identical coordinates', () => {
    const point = { lat: 6.5095, lng: 3.3711 }
    expect(getDistanceKm(point, point)).toBe(0)
  })

  it('calculates a known distance between Lagos zone centres', () => {
    const yaba = { lat: 6.5095, lng: 3.3711 }
    const surulere = { lat: 6.4926, lng: 3.3549 }
    const distance = getDistanceKm(yaba, surulere)

    expect(distance).toBeGreaterThan(2)
    expect(distance).toBeLessThan(3)
  })
})

describe('findNearestZone', () => {
  it('returns the zone whose centre is closest to the user', () => {
    const nearYaba = { lat: 6.5095, lng: 3.3711 }
    expect(findNearestZone(nearYaba, zones).id).toBe('yaba')
  })

  it('throws when no zones are available', () => {
    expect(() => findNearestZone({ lat: 0, lng: 0 }, [])).toThrow(
      'No delivery zones are available.',
    )
  })
})
