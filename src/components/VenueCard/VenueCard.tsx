import { Link } from 'react-router-dom'
import type { Venue } from '../../types'
import { isVenueOpen } from '../../utils/availability'
import './VenueCard.css'

interface VenueCardProps {
  venue: Venue
  estimatedDeliveryMinutes?: string
  isFavourited?: boolean
  onToggleFavourite?: () => void
}

function VenueCard({
  venue,
  estimatedDeliveryMinutes,
  isFavourited = false,
  onToggleFavourite,
}: VenueCardProps) {
  const open = isVenueOpen(venue)

  return (
    <article className={`venue-card${open ? '' : ' venue-card--closed'}`}>
      {!open && <div className="venue-card__closed-banner">Currently closed</div>}
      <Link to={`/venue/${venue.id}`} className="venue-card__link">
        {venue.imageUrl ? (
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="venue-card__image"
            loading="lazy"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
              ;(e.target as HTMLImageElement).nextElementSibling?.removeAttribute('hidden')
            }}
          />
        ) : null}
        <div
          className={`venue-card__placeholder venue-card__placeholder--${venue.type}`}
          aria-hidden="true"
          hidden={!!venue.imageUrl}
        >
          {venue.name.charAt(0)}
        </div>

        <div className="venue-card__body">
          <h3 className="venue-card__name">{venue.name}</h3>
          <div className="venue-card__rating" aria-label={`Rating ${venue.rating} out of 5, ${venue.reviewCount} reviews`}>
            <span className="venue-card__stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={`venue-card__star${i < Math.round(venue.rating) ? ' venue-card__star--filled' : ''}`}>★</span>
              ))}
            </span>
            <span className="venue-card__rating-text">{venue.rating}</span>
            <span className="venue-card__review-count">({venue.reviewCount})</span>
          </div>
          <div className="venue-card__meta">
            <span className={`venue-card__badge venue-card__badge--${venue.type}`}>
              {venue.type === 'buka' ? 'Buka' : 'Restaurant'}
            </span>
            <span className="venue-card__price">{venue.priceRange}</span>
            <span
              className={`venue-card__status ${
                open ? 'venue-card__status--open' : 'venue-card__status--closed'
              }`}
            >
              {open ? 'Open now' : 'Closed'}
            </span>
          </div>
          <div className="venue-card__footer">
            <span className="venue-card__distance">
              {venue.distanceKm} km away
            </span>
            {estimatedDeliveryMinutes && (
              <span className="venue-card__delivery">
                {estimatedDeliveryMinutes} min
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        className={`venue-card__favourite${isFavourited ? ' venue-card__favourite--active' : ''}`}
        aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
        onClick={(e) => {
          e.preventDefault()
          onToggleFavourite?.()
        }}
      >
        {isFavourited ? '♥' : '♡'}
      </button>
    </article>
  )
}

export default VenueCard
