import { useCallback, useState } from 'react'
import type { Order } from '../../types'
import { useCart } from '../../context/CartContext'
import { placeOrder as placeOrderInFirestore } from './CartModel'

export function useCartViewModel() {
  const {
    items,
    venue,
    zone,
    totals,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart()

  const [phone, setPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [landmark, setLandmark] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successOrder, setSuccessOrder] = useState<Order | null>(null)

  const handlePlaceOrder = useCallback(async () => {
    if (!venue || !zone || !totals || items.length === 0) {
      setError('Your cart is empty.')
      return
    }

    setLoading(true)
    setError(null)

    const order: Order = {
      items,
      subtotal: totals.subtotal,
      packFee: totals.packFee,
      deliveryFee: totals.deliveryFee,
      serviceCharge: totals.serviceCharge,
      total: totals.total,
      venueId: venue.id,
      venueName: venue.name,
      zoneId: zone.id,
      customerPhone: phone,
      deliveryAddress,
      landmark,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    try {
      await placeOrderInFirestore(order)
      setSuccessOrder(order)
      clearCart()
      setPhone('')
      setDeliveryAddress('')
      setLandmark('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order.')
    } finally {
      setLoading(false)
    }
  }, [venue, zone, totals, items, phone, deliveryAddress, landmark, clearCart])

  return {
    items,
    venue,
    zone,
    totals,
    phone,
    deliveryAddress,
    landmark,
    loading,
    error,
    successOrder,
    setPhone,
    setDeliveryAddress,
    setLandmark,
    removeItem,
    updateQuantity,
    handlePlaceOrder,
  }
}
