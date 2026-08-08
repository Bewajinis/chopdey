export interface Zone {
  id: string
  name: string
  centerLat: number
  centerLng: number
  deliveryFee: number
  estimatedDeliveryMinutes: string
}

export type VenueType = 'buka' | 'restaurant'

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  availableFrom: number
  availableUntil: number
}

export type PriceRange = '₦' | '₦₦' | '₦₦₦'

export interface Venue {
  id: string
  name: string
  type: VenueType
  zoneId: string
  lat: number
  lng: number
  imageUrl?: string
  openingHour: number
  closingHour: number
  packFee: number
  menu: MenuItem[]
  rating: number
  reviewCount: number
  priceRange: PriceRange
  distanceKm: number
}

export interface CartItem extends MenuItem {
  quantity: number
  venueId: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled'

export interface Order {
  items: CartItem[]
  subtotal: number
  packFee: number
  deliveryFee: number
  serviceCharge: number
  total: number
  venueId: string
  venueName: string
  zoneId: string
  customerPhone: string
  deliveryAddress: string
  landmark: string
  status: OrderStatus
  createdAt: string
  uid?: string
  customerEmail?: string
}
