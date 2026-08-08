import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Venue } from '../../types'
import { useAuth } from '../../context/AuthContext'
import {
  addFavourite,
  getFavourites,
  removeFavourite,
} from './FavouritesModel'

export function useFavouritesViewModel() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [favourites, setFavourites] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    let cancelled = false

    async function loadFavourites() {
      setLoading(true)
      setError(null)

      try {
        const venues = await getFavourites(user!.uid)
        if (!cancelled) setFavourites(venues)
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load favourites.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
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

      const isFav = favourites.some((v) => v.id === venue.id)

      try {
        if (isFav) {
          await removeFavourite(user.uid, venue.id)
          setFavourites((prev) => prev.filter((v) => v.id !== venue.id))
        } else {
          await addFavourite(user.uid, venue)
          setFavourites((prev) => [...prev, venue])
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update favourite.',
        )
      }
    },
    [user, favourites, navigate],
  )

  const isFavourited = useCallback(
    (venueId: string) => favourites.some((v) => v.id === venueId),
    [favourites],
  )

  return {
    favourites,
    loading,
    error,
    toggleFavourite,
    isFavourited,
  }
}
