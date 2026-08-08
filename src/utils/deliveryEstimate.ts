import type { Venue, Zone } from '../types'
import { getDistanceKm, type Coordinates } from '../services/locationService'

function parseTimeRange(range: string): { min: number; max: number } {
  const parts = range.split('-').map(Number)
  return { min: parts[0] || 20, max: parts[1] || 35 }
}

export function getVenueDeliveryEstimate(
  venue: Venue,
  zone: Zone,
): string {
  const zoneCenter: Coordinates = { lat: zone.centerLat, lng: zone.centerLng }
  const venueCoords: Coordinates = { lat: venue.lat, lng: venue.lng }
  const distanceKm = getDistanceKm(zoneCenter, venueCoords)

  const { min, max } = parseTimeRange(zone.estimatedDeliveryMinutes)

  const range = max - min
  const factor = Math.min(distanceKm / 3, 1)
  const venueMin = Math.round(min + range * factor * 0.3)
  const venueMax = Math.round(min + range * (0.5 + factor * 0.5))

  return `${venueMin}-${venueMax}`
}
