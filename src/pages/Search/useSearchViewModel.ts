import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  getActiveSearchZone,
  searchFood,
  type FoodSearchResult,
} from './SearchModel'

export function useSearchViewModel() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const [results, setResults] = useState<FoodSearchResult[]>([])
  const [zoneName, setZoneName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function runSearch() {
      const trimmed = query.trim()

      if (!trimmed) {
        setResults([])
        setValidationError(null)
        setError(null)
        setZoneName(null)
        setLoading(false)
        return
      }

      if (trimmed.length < 2) {
        setResults([])
        setValidationError('Enter at least 2 characters to search.')
        setError(null)
        setZoneName(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setValidationError(null)
      setError(null)

      try {
        const { zoneId, zoneName: name } = await getActiveSearchZone()
        const searchResults = await searchFood(trimmed, zoneId)

        if (cancelled) return

        setResults(searchResults)
        setZoneName(name)
      } catch (err) {
        if (cancelled) return

        if (err instanceof Error && err.message.includes('2 characters')) {
          setValidationError(err.message)
          setResults([])
        } else {
          setError(err instanceof Error ? err.message : 'Search failed.')
          setResults([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    runSearch()

    return () => {
      cancelled = true
    }
  }, [query])

  return {
    query,
    results,
    zoneName,
    loading,
    error,
    validationError,
  }
}
