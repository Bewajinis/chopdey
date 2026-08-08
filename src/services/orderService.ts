import { collection, addDoc } from 'firebase/firestore'
import type { Order } from '../types'
import { db } from './firebaseService'

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}

export async function saveOrder(order: Order): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'orders'), order)
    return docRef.id
  } catch (error) {
    throw new Error(`Failed to place order: ${describeError(error)}`)
  }
}
