import { useEffect, useState } from 'react'
import type { Order } from '../../types'
import { useAuth } from '../../context/AuthContext'
import { getOrders } from './OrdersModel'

export function useOrdersViewModel() {
  const { user } = useAuth()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    let cancelled = false

    async function loadOrders() {
      setLoading(true)
      setError(null)

      try {
        const data = await getOrders(user!.uid)
        if (!cancelled) setOrders(data)
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load orders.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadOrders()

    return () => {
      cancelled = true
    }
  }, [user])

  return {
    orders,
    loading,
    error,
  }
}
