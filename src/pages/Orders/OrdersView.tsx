import Loader from '../../components/Loader/Loader'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import EmptyState from '../../components/EmptyState/EmptyState'
import { useOrdersViewModel } from './useOrdersViewModel'
import './OrdersView.css'

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function OrdersView() {
  const { orders, loading, error } = useOrdersViewModel()

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
    <main className="page orders">
      <h1 className="orders__title">Order History</h1>

      {orders.length === 0 ? (
        <EmptyState
          message="No orders yet"
          hint="Your first meal is waiting"
        />
      ) : (
        <ul className="orders__list">
          {orders.map((order, index) => (
            <li key={order.id ?? index} className="orders__card">
              <div className="orders__card-header">
                <span className="orders__venue">{order.venueName}</span>
                <span
                  className={`orders__status orders__status--${order.status}`}
                >
                  {order.status}
                </span>
              </div>

              <p className="orders__date">{formatDate(order.createdAt)}</p>

              <ul className="orders__items">
                {order.items.map((item, i) => (
                  <li key={item.id ?? i} className="orders__item">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatNaira(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="orders__totals">
                <div className="orders__total-row">
                  <span>Subtotal</span>
                  <span>{formatNaira(order.subtotal)}</span>
                </div>
                <div className="orders__total-row">
                  <span>Pack fee</span>
                  <span>{formatNaira(order.packFee)}</span>
                </div>
                <div className="orders__total-row">
                  <span>Delivery</span>
                  <span>{formatNaira(order.deliveryFee)}</span>
                </div>
                <div className="orders__total-row">
                  <span>Service</span>
                  <span>{formatNaira(order.serviceCharge)}</span>
                </div>
                <div className="orders__total-row orders__total-row--final">
                  <span>Total</span>
                  <span>{formatNaira(order.total)}</span>
                </div>
              </div>

              <p className="orders__address">
                {order.deliveryAddress}
                {order.landmark ? ` (${order.landmark})` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default OrdersView
