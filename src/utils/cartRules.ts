import type { Venue } from '../types'

export type AddItemCheckResult =
  | { ok: true }
  | { ok: false; reason: 'different-venue'; currentVenueName: string }

export function checkCanAddItem(
  currentVenue: Venue | null,
  newVenue: Venue,
): AddItemCheckResult {
  if (currentVenue && currentVenue.id !== newVenue.id) {
    return {
      ok: false,
      reason: 'different-venue',
      currentVenueName: currentVenue.name,
    }
  }

  return { ok: true }
}
