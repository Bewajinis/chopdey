import { collection, addDoc } from 'firebase/firestore'
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
