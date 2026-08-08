import Loader from '../../components/Loader/Loader'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import FoodCard from '../../components/FoodCard/FoodCard'
import { isVenueOpen } from '../../utils/availability'
import { formatNaira } from '../../utils/formatNaira'
import { useVenueViewModel } from './useVenueViewModel'
import './VenueView.css'

function VenueView() {
  const {
    venue,
    loading,
    error,
    menuByCategory,
    pendingAdd,
    handleAddToCart,
    confirmClearAndAdd,
    cancelPendingAdd,
  } = useVenueViewModel()

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

  if (!venue) {
    return (
      <main className="page">
        <ErrorMessage error="Venue not found." />
      </main>
    )
  }

  const open = isVenueOpen(venue)

  return (
    <main className="page venue">
      <header className="venue__header">
        {venue.imageUrl ? (
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="venue__image"
          />
        ) : (
          <div
            className={`venue__placeholder venue__placeholder--${venue.type}`}
            aria-hidden="true"
          >
            {venue.name.charAt(0)}
          </div>
        )}

        <div className="venue__info">
          <h1 className="venue__name">{venue.name}</h1>
          <div className="venue__meta">
            <span className={`venue__badge venue__badge--${venue.type}`}>
              {venue.type === 'buka' ? 'Buka' : 'Restaurant'}
            </span>
            <span
              className={
                open ? 'venue__status venue__status--open' : 'venue__status venue__status--closed'
              }
            >
              {open ? 'Open now' : 'Closed'}
            </span>
          </div>
          <p className="venue__pack-fee">
            Pack fee: {formatNaira(venue.packFee)} (added at checkout)
          </p>
        </div>
      </header>

      {menuByCategory.map(({ category, items }) => (
        <section key={category} className="venue__section">
          <h2 className="venue__category">{category}</h2>
          <ul className="venue__menu">
            {items.map((item) => (
              <li key={item.id}>
                <FoodCard
                  item={item}
                  onAddToCart={() => handleAddToCart(item)}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {pendingAdd && (
        <div className="venue__dialog-backdrop" role="presentation">
          <div
            className="venue__dialog"
            role="alertdialog"
            aria-labelledby="cart-dialog-title"
            aria-describedby="cart-dialog-desc"
          >
            <h2 id="cart-dialog-title" className="venue__dialog-title">
              Start a new order?
            </h2>
            <p id="cart-dialog-desc" className="venue__dialog-text">
              Your cart has items from another venue. Clear the cart and add{' '}
              <strong>{pendingAdd.item.name}</strong> instead?
            </p>
            <div className="venue__dialog-actions">
              <button
                type="button"
                className="venue__dialog-cancel"
                onClick={cancelPendingAdd}
              >
                Keep current cart
              </button>
              <button
                type="button"
                className="venue__dialog-confirm"
                onClick={confirmClearAndAdd}
              >
                Clear &amp; add item
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default VenueView
