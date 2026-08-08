import type { Venue, Zone } from '../../types'
import { getVenuesByZone, getZones } from '../../services/venueService'
import {
  findNearestZone,
  getDistanceKm,
  getUserLocation,
  type Coordinates,
} from '../../services/locationService'
import { resolveInitialZoneId } from '../../utils/zoneStorage'

export { getStoredZoneId, storeZoneId, resolveInitialZoneId } from '../../utils/zoneStorage'

export async function getAllZones(): Promise<Zone[]> {
  return getZones()
}

export async function getVenuesForZone(zoneId: string): Promise<Venue[]> {
  return getVenuesByZone(zoneId)
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

export async function getActiveZoneId(): Promise<string> {
  const zones = await getZones()
  return resolveInitialZoneId(zones)
}
