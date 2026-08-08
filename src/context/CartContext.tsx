import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, MenuItem, Venue, Zone } from '../types'
import {
  calculateTotals,
  type CartTotals,
} from '../utils/cartCalculations'
import { checkCanAddItem } from '../utils/cartRules'
import { CART_STORAGE_KEY } from '../utils/validation'

interface StoredCart {
  items: CartItem[]
  venue: Venue | null
  zone: Zone | null
}

export type AddItemResult =
  | { ok: true }
  | { ok: false; reason: 'different-venue'; currentVenueName: string }

interface CartContextValue {
  items: CartItem[]
  venue: Venue | null
  zone: Zone | null
  itemCount: number
  totals: CartTotals | null
  addItem: (item: MenuItem, venue: Venue, zone: Zone) => AddItemResult
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function loadStoredCart(): StoredCart {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return { items: [], venue: null, zone: null }
    const parsed = JSON.parse(raw) as StoredCart
    return {
      items: parsed.items ?? [],
      venue: parsed.venue ?? null,
      zone: parsed.zone ?? null,
    }
  } catch {
    return { items: [], venue: null, zone: null }
  }
}

function persistCart(cart: StoredCart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredCart>(loadStoredCart)

  const sync = useCallback((next: StoredCart) => {
    setStored(next)
    persistCart(next)
  }, [])

  const clearCart = useCallback(() => {
    sync({ items: [], venue: null, zone: null })
  }, [sync])

  const addItem = useCallback(
    (item: MenuItem, venue: Venue, zone: Zone): AddItemResult => {
      const check = checkCanAddItem(stored.venue, venue)
      if (!check.ok) {
        return check
      }

      const existing = stored.items.find((i) => i.id === item.id)
      let nextItems: CartItem[]

      if (existing) {
        nextItems = stored.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        )
      } else {
        nextItems = [
          ...stored.items,
          { ...item, quantity: 1, venueId: venue.id },
        ]
      }

      sync({ items: nextItems, venue, zone })
      return { ok: true }
    },
    [stored, sync],
  )

  const removeItem = useCallback(
    (itemId: string) => {
      const nextItems = stored.items.filter((i) => i.id !== itemId)
      if (nextItems.length === 0) {
        clearCart()
        return
      }
      sync({ ...stored, items: nextItems })
    },
    [stored, sync, clearCart],
  )

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId)
        return
      }

      const nextItems = stored.items.map((i) =>
        i.id === itemId ? { ...i, quantity } : i,
      )
      sync({ ...stored, items: nextItems })
    },
    [stored, sync, removeItem],
  )

  const itemCount = useMemo(
    () => stored.items.reduce((sum, item) => sum + item.quantity, 0),
    [stored.items],
  )

  const totals = useMemo(() => {
    if (!stored.venue || !stored.zone || stored.items.length === 0) {
      return null
    }
    return calculateTotals(stored.items, stored.venue, stored.zone)
  }, [stored.items, stored.venue, stored.zone])

  const value = useMemo<CartContextValue>(
    () => ({
      items: stored.items,
      venue: stored.venue,
      zone: stored.zone,
      itemCount,
      totals,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      stored.items,
      stored.venue,
      stored.zone,
      itemCount,
      totals,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
