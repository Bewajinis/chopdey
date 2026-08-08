import type { Venue, Zone } from '../../types'
import { getVenuesByZone, getZones } from '../../services/venueService'
import {
  findNearestZone,
  getDistanceKm,
  getUserLocation,
  type Coordinates,
} from '../../services/locationService'

export const ZONE_STORAGE_KEY = 'chopdey-selected-zone'

const DEFAULT_ZONE_ID = 'yaba'

export async function getAllZones(): Promise<Zone[]> {
  return getZones()
}

export async function getVenuesForZone(zoneId: string): Promise<Venue[]> {
  return getVenuesByZone(zoneId)
}

export function getStoredZoneId(): string | null {
  try {
    return localStorage.getItem(ZONE_STORAGE_KEY)
  } catch {
    return null
  }
}

export function storeZoneId(zoneId: string): void {
  try {
    localStorage.setItem(ZONE_STORAGE_KEY, zoneId)
  } catch {
    // Ignore storage failures (private browsing, quota exceeded).
  }
}

export function resolveInitialZoneId(zones: Zone[]): string {
  const stored = getStoredZoneId()
  if (stored && zones.some((zone) => zone.id === stored)) {
    return stored
  }
  if (zones.some((zone) => zone.id === DEFAULT_ZONE_ID)) {
    return DEFAULT_ZONE_ID
  }
  return zones[0]?.id ?? DEFAULT_ZONE_ID
}

export function sortVenuesByDistance(
  venues: Venue[],
  userLocation: Coordinates,
): Venue[] {
  return [...venues].sort((a, b) => {
    const distanceA = getDistanceKm(userLocation, { lat: a.lat, lng: a.lng })
    const distanceB = getDistanceKm(userLocation, { lat: b.lat, lng: b.lng })
    return distanceA - distanceB
  })
}

export async function detectNearestZone(): Promise<{
  zone: Zone
  location: Coordinates
  zones: Zone[]
}> {
  const [location, zones] = await Promise.all([getUserLocation(), getZones()])
  const zone = findNearestZone(location, zones)
  return { zone, location, zones }
}
