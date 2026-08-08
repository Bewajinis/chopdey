import Loader from '../../components/Loader/Loader'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import EmptyState from '../../components/EmptyState/EmptyState'
import VenueCard from '../../components/VenueCard/VenueCard'
import { useFavouritesViewModel } from './useFavouritesViewModel'
import './FavouritesView.css'

function FavouritesView() {
  const { favourites, loading, error, toggleFavourite, isFavourited } =
    useFavouritesViewModel()

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

  return (
    <main className="page favourites">
      <h1 className="favourites__title">Your Favourite Spots</h1>

      {favourites.length === 0 ? (
        <EmptyState
          message="No favourite spots yet"
          hint="Go find your buka!"
        />
      ) : (
        <ul className="favourites__grid">
          {favourites.map((venue) => (
            <li key={venue.id}>
              <VenueCard
                venue={venue}
                isFavourited={isFavourited(venue.id)}
                onToggleFavourite={() => toggleFavourite(venue)}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default FavouritesView
