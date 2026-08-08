import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore'
import type { Venue } from '../types'
import { db } from './firebaseService'

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}

function favouritesCollection(userId: string) {
  return collection(db, 'users', userId, 'favourites')
}

function favouriteDoc(userId: string, venueId: string) {
  return doc(db, 'users', userId, 'favourites', venueId)
}

function mapFavouriteDoc(docSnapshot: ReturnType<typeof doc>): Venue {
  const data = docSnapshot.data()
  return {
    id: docSnapshot.id,
    name: data.name as string,
    type: data.type as Venue['type'],
    zoneId: data.zoneId as string,
    lat: data.lat as number,
    lng: data.lng as number,
    imageUrl: (data.imageUrl as string) ?? '',
    openingHour: data.openingHour as number,
    closingHour: data.closingHour as number,
    packFee: data.packFee as number,
    menu: data.menu as Venue['menu'],
    rating: (data.rating as number) ?? 0,
    reviewCount: (data.reviewCount as number) ?? 0,
    priceRange: (data.priceRange as Venue['priceRange']) ?? '₦',
    distanceKm: (data.distanceKm as number) ?? 0,
  }
}

export async function addFavourite(
  userId: string,
  venue: Venue,
): Promise<void> {
  if (!userId) {
    throw new Error('A user is required to add favourites.')
  }

  try {
    await setDoc(favouriteDoc(userId, venue.id), {
      name: venue.name,
      type: venue.type,
      zoneId: venue.zoneId,
      lat: venue.lat,
      lng: venue.lng,
      imageUrl: venue.imageUrl ?? '',
      openingHour: venue.openingHour,
      closingHour: venue.closingHour,
      packFee: venue.packFee,
      menu: venue.menu,
      rating: venue.rating,
      reviewCount: venue.reviewCount,
      priceRange: venue.priceRange,
      distanceKm: venue.distanceKm,
    })
  } catch (error) {
    throw new Error(`Failed to add favourite: ${describeError(error)}`)
  }
}

export async function removeFavourite(
  userId: string,
  venueId: string,
): Promise<void> {
  if (!userId) {
    throw new Error('A user is required to remove favourites.')
  }

  try {
    await deleteDoc(favouriteDoc(userId, venueId))
  } catch (error) {
    throw new Error(`Failed to remove favourite: ${describeError(error)}`)
  }
}

export async function getFavourites(userId: string): Promise<Venue[]> {
  if (!userId) {
    throw new Error('A user is required to load favourites.')
  }

  try {
    const snapshot = await getDocs(favouritesCollection(userId))
    return snapshot.docs.map(mapFavouriteDoc)
  } catch (error) {
    throw new Error(`Failed to load favourites: ${describeError(error)}`)
  }
}

export async function isFavourited(
  userId: string,
  venueId: string,
): Promise<boolean> {
  if (!userId) return false

  try {
    const docSnapshot = await getDoc(favouriteDoc(userId, venueId))
    return docSnapshot.exists()
  } catch {
    return false
  }
}
