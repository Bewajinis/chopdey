import type { Venue } from '../../types'
import {
  addFavourite as addFavouriteToStore,
  getFavourites as getFavouritesFromStore,
  removeFavourite as removeFavouriteFromStore,
} from '../../services/favouritesService'

export async function getFavourites(userId: string): Promise<Venue[]> {
  return getFavouritesFromStore(userId)
}

export async function addFavourite(
  userId: string,
  venue: Venue,
): Promise<void> {
  await addFavouriteToStore(userId, venue)
}

export async function removeFavourite(
  userId: string,
  venueId: string,
): Promise<void> {
  await removeFavouriteFromStore(userId, venueId)
}
