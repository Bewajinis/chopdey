import type { Zone } from '../types'

export const ZONE_STORAGE_KEY = 'chopdey-selected-zone'

const DEFAULT_ZONE_ID = 'yaba'

export function getStoredZoneId(): string | null {
  try {
    return localStorage.getItem(ZONE_STORAGE_KEY)
  } catch {
    return null
  }
}

export function storeZoneId(zoneId: string): void {
  try {
    localStorage.setItem(ZONE_STORAGE_KEY, zoneId)
  } catch {
    // Ignore storage failures (private browsing, quota exceeded).
  }
}

export function resolveInitialZoneId(zones: Zone[]): string {
  const stored = getStoredZoneId()
  if (stored && zones.some((zone) => zone.id === stored)) {
    return stored
  }
  if (zones.some((zone) => zone.id === DEFAULT_ZONE_ID)) {
    return DEFAULT_ZONE_ID
  }
  return zones[0]?.id ?? DEFAULT_ZONE_ID
}

export function resolveZoneName(zones: Zone[], zoneId: string): string {
  return zones.find((zone) => zone.id === zoneId)?.name ?? zoneId
}
