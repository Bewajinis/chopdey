import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Venue, VenueType, Zone } from '../../types'
import { useAuth } from '../../context/AuthContext'
import { isVenueOpen } from '../../utils/availability'
import type { Coordinates } from '../../services/locationService'
import {
  addFavourite,
  getFavourites,
  removeFavourite,
} from '../../services/favouritesService'
import {
  detectNearestZone,
  getAllZones,
  getVenuesForZone,
  resolveInitialZoneId,
  sortVenuesByDistance,
  storeZoneId,
} from './HomeModel'

export type VenueTypeFilter = 'all' | VenueType

export function useHomeViewModel() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [zones, setZones] = useState<Zone[]>([])
  const [zone, setZone] = useState<Zone | null>(null)
  const [venues, setVenues] = useState<Venue[]>([])
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [locationLoading, setLocationLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationMessage, setLocationMessage] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<VenueTypeFilter>('all')
  const [openNowOnly, setOpenNowOnly] = useState(false)

  const loadZoneVenues = useCallback(
    async (zoneId: string, location: Coordinates | null) => {
      const venueList = await getVenuesForZone(zoneId)
      const sortedVenues = location
        ? sortVenuesByDistance(venueList, location)
        : venueList
      setVenues(sortedVenues)
    },
    [],
  )

  useEffect(() => {
    let cancelled = false

    async function init() {
      setLoading(true)
      setError(null)

      try {
        const zoneList = await getAllZones()
        if (cancelled) return

        const initialZoneId = resolveInitialZoneId(zoneList)
        const initialZone =
          zoneList.find((item) => item.id === initialZoneId) ?? null

        setZones(zoneList)
        setZone(initialZone)
        await loadZoneVenues(initialZoneId, null)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load venues.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [loadZoneVenues])

  const handleUseMyLocation = useCallback(async () => {
    setLocationLoading(true)
    setLocationMessage(null)
    setError(null)

    try {
      const { zone: nearestZone, location, zones: zoneList } =
        await detectNearestZone()

      setZones(zoneList)
      setZone(nearestZone)
      setUserLocation(location)
      storeZoneId(nearestZone.id)
      await loadZoneVenues(nearestZone.id, location)
    } catch (err) {
      setLocationMessage(
        err instanceof Error
          ? err.message
          : 'Could not detect your location. Pick a delivery zone below.',
      )
    } finally {
      setLocationLoading(false)
    }
  }, [loadZoneVenues])

  const handleZoneChange = useCallback(
    async (zoneId: string) => {
      const selectedZone = zones.find((item) => item.id === zoneId) ?? null
      setZone(selectedZone)
      storeZoneId(zoneId)
      setError(null)
      setLocationMessage(null)
      setLoading(true)

      try {
        await loadZoneVenues(zoneId, userLocation)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load venues.')
      } finally {
        setLoading(false)
      }
    },
    [zones, userLocation, loadZoneVenues],
  )

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      if (typeFilter !== 'all' && venue.type !== typeFilter) {
        return false
      }
      if (openNowOnly && !isVenueOpen(venue)) {
        return false
      }
      return true
    })
  }, [venues, typeFilter, openNowOnly])

  useEffect(() => {
    if (!user) {
      setFavouriteIds(new Set())
      return
    }

    let cancelled = false

    async function loadFavourites() {
      try {
        const favourites = await getFavourites(user!.uid)
        if (!cancelled) {
          setFavouriteIds(new Set(favourites.map((v) => v.id)))
        }
      } catch {
        // Silently fail — favourites are non-critical
      }
    }

    loadFavourites()

    return () => {
      cancelled = true
    }
  }, [user])

  const toggleFavourite = useCallback(
    async (venue: Venue) => {
      if (!user) {
        navigate('/auth')
        return
      }

      const isFav = favouriteIds.has(venue.id)

      try {
        if (isFav) {
          await removeFavourite(user.uid, venue.id)
          setFavouriteIds((prev) => {
            const next = new Set(prev)
            next.delete(venue.id)
            return next
          })
        } else {
          await addFavourite(user.uid, venue)
          setFavouriteIds((prev) => new Set(prev).add(venue.id))
        }
      } catch {
        // Silently fail — favourite toggle is non-critical
      }
    },
    [user, favouriteIds, navigate],
  )

  const isFavourited = useCallback(
    (venueId: string) => favouriteIds.has(venueId),
    [favouriteIds],
  )

  return {
    zones,
    zone,
    venues: filteredVenues,
    hasVenuesInZone: venues.length > 0,
    loading,
    locationLoading,
    error,
    locationMessage,
    typeFilter,
    openNowOnly,
    setTypeFilter,
    setOpenNowOnly,
    handleUseMyLocation,
    handleZoneChange,
    toggleFavourite,
    isFavourited,
  }
}
