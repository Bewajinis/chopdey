import { useEffect, useState } from 'react'
import type { Venue, Zone } from '../../types'
import { getVenuesForZone, getZoneById } from './HomeModel'

const DEFAULT_ZONE_ID = 'yaba'

export function useHomeViewModel() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [zone, setZone] = useState<Zone | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const [zoneData, venueList] = await Promise.all([
          getZoneById(DEFAULT_ZONE_ID),
          getVenuesForZone(DEFAULT_ZONE_ID),
        ])

        if (cancelled) return

        setZone(zoneData)
        setVenues(venueList)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load venues.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { venues, zone, loading, error }
}
