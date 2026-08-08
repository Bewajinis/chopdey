import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore'
import type { Order } from '../types'
import { db } from './firebaseService'

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}

function buildOrderPayload(order: Order): Record<string, unknown> {
  const payload: Record<string, unknown> = { ...order }

  if (!order.uid) {
    delete payload.uid
    delete payload.customerEmail
  }

  return payload
}

export async function saveOrder(order: Order): Promise<string> {
  try {
    const docRef = await addDoc(
      collection(db, 'orders'),
      buildOrderPayload(order),
    )
    return docRef.id
  } catch (error) {
    throw new Error(`Failed to place order: ${describeError(error)}`)
  }
}

export async function getOrders(userId: string): Promise<Order[]> {
  if (!userId) {
    throw new Error('A user is required to load orders.')
  }

  try {
    const ordersRef = collection(db, 'orders')
    const q = query(
      ordersRef,
      where('uid', '==', userId),
      orderBy('createdAt', 'desc'),
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[]
  } catch (error) {
    throw new Error(`Failed to load orders: ${describeError(error)}`)
  }
}
