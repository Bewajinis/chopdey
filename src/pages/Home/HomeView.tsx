import Loader from '../../components/Loader/Loader'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import EmptyState from '../../components/EmptyState/EmptyState'
import VenueCard from '../../components/VenueCard/VenueCard'
import { useHomeViewModel } from './useHomeViewModel'
import './HomeView.css'

function HomeView() {
  const {
    zones,
    zone,
    venues,
    hasVenuesInZone,
    loading,
    locationLoading,
    error,
    locationMessage,
    typeFilter,
    openNowOnly,
    setTypeFilter,
    setOpenNowOnly,
    handleUseMyLocation,
    handleZoneChange,
  } = useHomeViewModel()

  if (loading && !zone) {
    return (
      <main className="page">
        <Loader />
      </main>
    )
  }

  return (
    <main className="page home">
      <header className="home__header">
        <h1 className="home__title">
          {zone ? `Showing food near ${zone.name}` : 'Find food near you'}
        </h1>

        <div className="home__controls">
          <button
            type="button"
            className="home__location-btn"
            onClick={handleUseMyLocation}
            disabled={locationLoading}
          >
            {locationLoading ? 'Finding location…' : 'Use my location'}
          </button>

          <label className="home__zone-label">
            Delivery zone
            <select
              className="home__zone-select"
              value={zone?.id ?? ''}
              onChange={(e) => handleZoneChange(e.target.value)}
              disabled={loading || zones.length === 0}
            >
              {zones.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {locationMessage && (
          <p className="home__location-message" role="status">
            {locationMessage}
          </p>
        )}

        {error && <ErrorMessage error={error} />}
      </header>

      <div className="home__filters" role="group" aria-label="Venue filters">
        <div className="home__filter-chips">
          {(['all', 'buka', 'restaurant'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              className={`home__chip${
                typeFilter === filter ? ' home__chip--active' : ''
              }`}
              onClick={() => setTypeFilter(filter)}
            >
              {filter === 'all'
                ? 'All'
                : filter === 'buka'
                  ? 'Buka'
                  : 'Restaurant'}
            </button>
          ))}
        </div>

        <label className="home__open-toggle">
          <input
            type="checkbox"
            checked={openNowOnly}
            onChange={(e) => setOpenNowOnly(e.target.checked)}
          />
          Open now
        </label>
      </div>

      {loading ? (
        <Loader />
      ) : !hasVenuesInZone ? (
        <EmptyState
          message="No venues found in this area."
          hint="Try another delivery zone or check back soon."
        />
      ) : venues.length === 0 ? (
        <EmptyState
          message="No venues match your filters."
          hint="Try switching to All or turning off Open now."
        />
      ) : (
        <ul className="home__grid">
          {venues.map((venue) => (
            <li key={venue.id}>
              <VenueCard
                venue={venue}
                estimatedDeliveryMinutes={zone?.estimatedDeliveryMinutes}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default HomeView
