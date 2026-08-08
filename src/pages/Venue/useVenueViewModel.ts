import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { MenuItem, Venue, Zone } from '../../types'
import { useCart } from '../../context/CartContext'
import { getZones } from '../../services/venueService'
import { getVenue } from './VenueModel'

interface PendingAdd {
  item: MenuItem
}

export function useVenueViewModel() {
  const { id } = useParams<{ id: string }>()
  const { addItem, clearCart } = useCart()

  const [venue, setVenue] = useState<Venue | null>(null)
  const [zone, setZone] = useState<Zone | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingAdd, setPendingAdd] = useState<PendingAdd | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Invalid venue id.')
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const [venueData, zones] = await Promise.all([getVenue(id!), getZones()])
        const zoneData = zones.find((z) => z.id === venueData.zoneId) ?? null

        if (cancelled) return

        setVenue(venueData)
        setZone(zoneData)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load venue.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id])

  const menuByCategory = useMemo(() => {
    if (!venue) return []

    const grouped = new Map<string, MenuItem[]>()

    for (const item of venue.menu) {
      const list = grouped.get(item.category) ?? []
      list.push(item)
      grouped.set(item.category, list)
    }

    return Array.from(grouped.entries()).map(([category, items]) => ({
      category,
      items,
    }))
  }, [venue])

  const handleAddToCart = useCallback(
    (item: MenuItem) => {
      if (!venue || !zone) return

      const result = addItem(item, venue, zone)

      if (!result.ok && result.reason === 'different-venue') {
        setPendingAdd({ item })
      }
    },
    [addItem, venue, zone],
  )

  const confirmClearAndAdd = useCallback(() => {
    if (!pendingAdd || !venue || !zone) return

    clearCart()
    addItem(pendingAdd.item, venue, zone)
    setPendingAdd(null)
  }, [pendingAdd, venue, zone, clearCart, addItem])

  const cancelPendingAdd = useCallback(() => {
    setPendingAdd(null)
  }, [])

  return {
    venue,
    zone,
    loading,
    error,
    menuByCategory,
    pendingAdd,
    handleAddToCart,
    confirmClearAndAdd,
    cancelPendingAdd,
  }
}
