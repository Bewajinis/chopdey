import { Link } from 'react-router-dom'
import type { Venue } from '../../types'
import { isVenueOpen } from '../../utils/availability'
import './VenueCard.css'

interface VenueCardProps {
  venue: Venue
  estimatedDeliveryMinutes?: string
}

function VenueCard({ venue, estimatedDeliveryMinutes }: VenueCardProps) {
  const open = isVenueOpen(venue)

  return (
    <article className={`venue-card${open ? '' : ' venue-card--closed'}`}>
      <Link to={`/venue/${venue.id}`} className="venue-card__link">
        {venue.imageUrl ? (
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="venue-card__image"
          />
        ) : (
          <div
            className={`venue-card__placeholder venue-card__placeholder--${venue.type}`}
            aria-hidden="true"
          >
            {venue.name.charAt(0)}
          </div>
        )}

        <div className="venue-card__body">
          <h3 className="venue-card__name">{venue.name}</h3>
          <div className="venue-card__meta">
            <span className={`venue-card__badge venue-card__badge--${venue.type}`}>
              {venue.type === 'buka' ? 'Buka' : 'Restaurant'}
            </span>
            <span
              className={`venue-card__status ${
                open ? 'venue-card__status--open' : 'venue-card__status--closed'
              }`}
            >
              {open ? 'Open now' : 'Closed'}
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
        className="venue-card__favourite"
        aria-label="Add to favourites"
        onClick={(e) => e.preventDefault()}
      >
        ♡
      </button>
    </article>
  )
}

export default VenueCard
