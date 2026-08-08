import { Link } from 'react-router-dom'
import Loader from '../../components/Loader/Loader'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import EmptyState from '../../components/EmptyState/EmptyState'
import FoodCard from '../../components/FoodCard/FoodCard'
import { useSearchViewModel } from './useSearchViewModel'
import './SearchView.css'

function SearchView() {
  const { query, results, zoneName, loading, error, validationError } =
    useSearchViewModel()

  const hasQuery = query.trim().length > 0

  return (
    <main className="page search">
      <h1 className="search__title">Search</h1>

      {!hasQuery && (
        <EmptyState
          message="Search for food across venues in your zone."
          hint='Try "jollof" or "shawarma" from the search bar above.'
        />
      )}

      {validationError && (
        <p className="search__validation" role="alert">
          {validationError}
        </p>
      )}

      {error && <ErrorMessage error={error} />}

      {hasQuery && !validationError && (
        <>
          {zoneName && (
            <p className="search__zone">
              Results in <strong>{zoneName}</strong>
            </p>
          )}

          {loading ? (
            <Loader />
          ) : results.length === 0 ? (
            <EmptyState
              message={`No results for "${query.trim()}".`}
              hint="Try a different spelling or pick another zone on Home."
            />
          ) : (
            <ul className="search__results">
              {results.map(({ item, venue }) => (
                <li key={`${venue.id}-${item.id}`} className="search__result">
                  <p className="search__venue">
                    <Link to={`/venue/${venue.id}`} className="search__venue-link">
                      from {venue.name}
                    </Link>
                  </p>
                  <FoodCard item={item} onAddToCart={() => {}} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  )
}

export default SearchView
