import type { MenuItem, Venue } from '../types'

export function isVenueOpen(venue: Venue, now: Date = new Date()): boolean {
  const hour = now.getHours()
  return hour >= venue.openingHour && hour < venue.closingHour
}

export function isMenuItemAvailable(
  item: MenuItem,
  now: Date = new Date(),
): boolean {
  const hour = now.getHours()
  return hour >= item.availableFrom && hour < item.availableUntil
}
