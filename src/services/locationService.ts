import type { Zone } from '../types'

export interface Coordinates {
  lat: number
  lng: number
}

const EARTH_RADIUS_KM = 6371

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

export function getDistanceKm(a: Coordinates, b: Coordinates): number {
  const latDelta = toRadians(b.lat - a.lat)
  const lngDelta = toRadians(b.lng - a.lng)
  const lat1 = toRadians(a.lat)
  const lat2 = toRadians(b.lat)

  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngDelta / 2) ** 2

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

export function findNearestZone(location: Coordinates, zones: Zone[]): Zone {
  if (zones.length === 0) {
    throw new Error('No delivery zones are available.')
  }

  let nearest = zones[0]
  let nearestDistance = getDistanceKm(location, {
    lat: nearest.centerLat,
    lng: nearest.centerLng,
  })

  for (let i = 1; i < zones.length; i += 1) {
    const zone = zones[i]
    const distance = getDistanceKm(location, {
      lat: zone.centerLat,
      lng: zone.centerLng,
    })

    if (distance < nearestDistance) {
      nearest = zone
      nearestDistance = distance
    }
  }

  return nearest
}

export function getUserLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported on this device.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(
            new Error(
              'Location access was denied. Pick a delivery zone from the list below.',
            ),
          )
          return
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          reject(
            new Error(
              'Your location is unavailable right now. Pick a delivery zone from the list below.',
            ),
          )
          return
        }

        reject(
          new Error(
            'Could not detect your location. Pick a delivery zone from the list below.',
          ),
        )
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    )
  })
}
