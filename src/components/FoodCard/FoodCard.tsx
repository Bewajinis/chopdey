import type { MenuItem } from '../../types'
import { isMenuItemAvailable } from '../../utils/availability'
import { formatNaira } from '../../utils/formatNaira'
import './FoodCard.css'

interface FoodCardProps {
  item: MenuItem
  onAddToCart: () => void
}

function FoodCard({ item, onAddToCart }: FoodCardProps) {
  const available = isMenuItemAvailable(item)

  return (
    <article className={`food-card${available ? '' : ' food-card--sold-out'}`}>
      <div className="food-card__info">
        <h3 className="food-card__name">{item.name}</h3>
        <p className="food-card__category">{item.category}</p>
        <p className="food-card__price">{formatNaira(item.price)}</p>
        {!available && (
          <p className="food-card__status" aria-live="polite">
            Sold out
          </p>
        )}
      </div>
      <button
        type="button"
        className="food-card__add"
        onClick={onAddToCart}
        disabled={!available}
      >
        Add to cart
      </button>
    </article>
  )
}

export default FoodCard
