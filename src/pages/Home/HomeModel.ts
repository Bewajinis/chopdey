import type { Venue, Zone } from '../../types'
import { getVenuesByZone, getZones } from '../../services/venueService'

export async function getVenuesForZone(zoneId: string): Promise<Venue[]> {
  return getVenuesByZone(zoneId)
}

export async function getZoneById(zoneId: string): Promise<Zone | null> {
  const zones = await getZones()
  return zones.find((zone) => zone.id === zoneId) ?? null
}
