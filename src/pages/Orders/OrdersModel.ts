import type { Order } from '../../types'
import { getOrders as getOrdersFromStore } from '../../services/orderService'

export async function getOrders(userId: string): Promise<Order[]> {
  return getOrdersFromStore(userId)
}
