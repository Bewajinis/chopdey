import EmptyState from '../../components/EmptyState/EmptyState'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import { formatNaira } from '../../utils/formatNaira'
import { useCartViewModel } from './useCartViewModel'
import './CartView.css'

function CartView() {
  const {
    items,
    venue,
    totals,
    phone,
    deliveryAddress,
    landmark,
    loading,
    error,
    successOrder,
    setPhone,
    setDeliveryAddress,
    setLandmark,
    removeItem,
    updateQuantity,
    handlePlaceOrder,
  } = useCartViewModel()

  if (successOrder) {
    return (
      <main className="page cart">
        <div className="cart__success" role="status">
          <h1 className="cart__success-title">Order placed!</h1>
          <p className="cart__success-text">
            Your order from <strong>{successOrder.venueName}</strong> is on its
            way. Total: {formatNaira(successOrder.total)}.
          </p>
          <ul className="cart__success-items">
            {successOrder.items.map((item) => (
              <li key={item.id}>
                {item.quantity}× {item.name}
              </li>
            ))}
          </ul>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="page cart">
        <EmptyState
          message="Your cart is empty."
          hint="Browse venues on Home and add something tasty."
        />
      </main>
    )
  }

  return (
    <main className="page cart">
      <h1 className="cart__title">Your cart</h1>
      {venue && <p className="cart__venue">From {venue.name}</p>}

      <ul className="cart__items">
        {items.map((item) => (
          <li key={item.id} className="cart__item">
            <div className="cart__item-info">
              <span className="cart__item-name">{item.name}</span>
              <span className="cart__item-price">
                {formatNaira(item.price * item.quantity)}
              </span>
            </div>
            <div className="cart__item-controls">
              <button
                type="button"
                className="cart__qty-btn"
                aria-label={`Decrease ${item.name} quantity`}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                −
              </button>
              <span className="cart__qty">{item.quantity}</span>
              <button
                type="button"
                className="cart__qty-btn"
                aria-label={`Increase ${item.name} quantity`}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
              <button
                type="button"
                className="cart__remove"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {totals && (
        <section className="cart__breakdown" aria-label="Order summary">
          <div className="cart__row">
            <span>Subtotal</span>
            <span>{formatNaira(totals.subtotal)}</span>
          </div>
          <div className="cart__row">
            <span>Pack fee</span>
            <span>{formatNaira(totals.packFee)}</span>
          </div>
          <div className="cart__row">
            <span>Delivery fee</span>
            <span>{formatNaira(totals.deliveryFee)}</span>
          </div>
          <div className="cart__row">
            <span>Service charge (5%)</span>
            <span>{formatNaira(totals.serviceCharge)}</span>
          </div>
          <div className="cart__row cart__row--total">
            <span>Total</span>
            <span>{formatNaira(totals.total)}</span>
          </div>
        </section>
      )}

      <section className="cart__checkout">
        <h2 className="cart__checkout-title">Delivery details</h2>

        {error && <ErrorMessage error={error} />}

        <form
          className="cart__form"
          onSubmit={(e) => {
            e.preventDefault()
            handlePlaceOrder()
          }}
        >
          <label className="cart__label">
            Phone number
            <input
              type="tel"
              className="cart__input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08012345678"
              required
              autoComplete="tel"
            />
          </label>

          <label className="cart__label">
            Delivery address
            <input
              type="text"
              className="cart__input"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="House number and street"
              required
              autoComplete="street-address"
            />
          </label>

          <label className="cart__label">
            Landmark
            <span className="cart__label-hint">
              Optional — e.g. beside the yellow gate
            </span>
            <input
              type="text"
              className="cart__input"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Nearby landmark"
            />
          </label>

          <button
            type="submit"
            className="cart__submit"
            disabled={loading}
          >
            {loading ? 'Placing order…' : 'Place order'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default CartView
