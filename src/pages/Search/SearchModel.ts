import type { MenuItem, Venue } from '../../types'
import { getVenuesByZone, getZones } from '../../services/venueService'
import { resolveInitialZoneId, resolveZoneName } from '../../utils/zoneStorage'

export interface FoodSearchResult {
  item: MenuItem
  venue: Venue
}

export function validateSearchQuery(query: string): string {
  const trimmed = query.trim()

  if (trimmed.length < 2) {
    throw new Error('Enter at least 2 characters to search.')
  }

  return trimmed
}

export async function getActiveSearchZone(): Promise<{
  zoneId: string
  zoneName: string
}> {
  const zones = await getZones()
  const zoneId = resolveInitialZoneId(zones)
  return { zoneId, zoneName: resolveZoneName(zones, zoneId) }
}

export async function searchFood(
  query: string,
  zoneId: string,
): Promise<FoodSearchResult[]> {
  const normalized = validateSearchQuery(query)

  if (!zoneId.trim()) {
    throw new Error('Select a delivery zone on Home before searching.')
  }

  const venues = await getVenuesByZone(zoneId)
  const lowerQuery = normalized.toLowerCase()
  const results: FoodSearchResult[] = []

  for (const venue of venues) {
    for (const item of venue.menu) {
      if (item.name.toLowerCase().includes(lowerQuery)) {
        results.push({ item, venue })
      }
    }
  }

  return results
}
