import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import type { Venue, Zone } from '../types'
import { db } from './firebaseService'

function mapZone(id: string, data: Record<string, unknown>): Zone {
  return {
    id,
    name: data.name as string,
    centerLat: data.centerLat as number,
    centerLng: data.centerLng as number,
    deliveryFee: data.deliveryFee as number,
    estimatedDeliveryMinutes: data.estimatedDeliveryMinutes as string,
  }
}

function mapVenue(id: string, data: Record<string, unknown>): Venue {
  return {
    id,
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

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}

export async function getZones(): Promise<Zone[]> {
  try {
    const snapshot = await getDocs(collection(db, 'zones'))
    return snapshot.docs.map((d) => mapZone(d.id, d.data()))
  } catch (error) {
    throw new Error(`Failed to load delivery zones: ${describeError(error)}`)
  }
}

export async function getVenuesByZone(zoneId: string): Promise<Venue[]> {
  if (!zoneId.trim()) {
    throw new Error('A zone is required to load venues.')
  }

  try {
    const q = query(collection(db, 'venues'), where('zoneId', '==', zoneId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => mapVenue(d.id, d.data()))
  } catch (error) {
    throw new Error(
      `Failed to load venues for zone "${zoneId}": ${describeError(error)}`,
    )
  }
}

export async function getVenueById(venueId: string): Promise<Venue> {
  if (!venueId.trim()) {
    throw new Error('A venue id is required.')
  }

  try {
    const snapshot = await getDoc(doc(db, 'venues', venueId))

    if (!snapshot.exists()) {
      throw new Error(`Venue "${venueId}" was not found.`)
    }

    return mapVenue(snapshot.id, snapshot.data())
  } catch (error) {
    if (error instanceof Error && error.message.includes('was not found')) {
      throw error
    }
    throw new Error(
      `Failed to load venue "${venueId}": ${describeError(error)}`,
    )
  }
}
