import type { Venue } from '../../types'
import { getVenueById } from '../../services/venueService'

export async function getVenue(venueId: string): Promise<Venue> {
  const trimmed = venueId.trim()

  if (!trimmed) {
    throw new Error('Invalid venue id.')
  }

  return getVenueById(trimmed)
}
