import Loader from '../../components/Loader/Loader'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import EmptyState from '../../components/EmptyState/EmptyState'
import VenueCard from '../../components/VenueCard/VenueCard'
import { useHomeViewModel } from './useHomeViewModel'
import './HomeView.css'

function HomeView() {
  const { venues, zone, loading, error } = useHomeViewModel()

  if (loading) {
    return (
      <main className="page">
        <Loader />
      </main>
    )
  }

  if (error) {
    return (
      <main className="page">
        <ErrorMessage error={error} />
      </main>
    )
  }

  if (venues.length === 0) {
    return (
      <main className="page">
        <EmptyState
          message="No venues found in this area."
          hint="Check back soon — new spots are always opening up."
        />
      </main>
    )
  }

  return (
    <main className="page home">
      <h1 className="home__title">Food near Yaba</h1>
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
    </main>
  )
}

export default HomeView
