import type { Order } from '../../types'
import {
  isValidNigerianPhone,
  normalizeNigerianPhone,
  validateDeliveryAddress,
} from '../../utils/validation'
import { saveOrder } from '../../services/orderService'

export interface CheckoutDetails {
  phone: string
  deliveryAddress: string
  landmark: string
}

export function validateCheckout(details: CheckoutDetails): string | null {
  const phone = details.phone.trim()
  const addressError = validateDeliveryAddress(details.deliveryAddress)

  if (!phone) {
    return 'Phone number is required.'
  }

  if (!isValidNigerianPhone(phone)) {
    return 'Enter a valid Nigerian phone number (e.g. 08012345678).'
  }

  if (addressError) {
    return addressError
  }

  return null
}

export async function placeOrder(order: Order): Promise<string> {
  const validationError = validateCheckout({
    phone: order.customerPhone,
    deliveryAddress: order.deliveryAddress,
    landmark: order.landmark,
  })

  if (validationError) {
    throw new Error(validationError)
  }

  const normalizedOrder: Order = {
    ...order,
    customerPhone: normalizeNigerianPhone(order.customerPhone),
  }

  return saveOrder(normalizedOrder)
}
