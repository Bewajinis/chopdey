import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState, type FormEvent } from 'react'
import { useCart } from '../../context/CartContext'
import './Header.css'

function Header() {
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    setSearchQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = searchQuery.trim()
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
  }

  return (
    <header className="header">
      <div className="header__top">
        <Link to="/" className="header__brand">
          ChopDey
        </Link>

        <form
          className="header__search"
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <input
            type="search"
            className="header__search-input"
            placeholder="Search for food…"
            aria-label="Search for food"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="header__search-button">
            Search
          </button>
        </form>

        <button type="button" className="header__login">
          Login
        </button>
      </div>

      <nav className="header__nav" aria-label="Main navigation">
        <NavLink to="/" className="header__nav-link" end>
          Home
        </NavLink>
        <NavLink to="/favourites" className="header__nav-link">
          Favourites
        </NavLink>
        <NavLink to="/orders" className="header__nav-link">
          Orders
        </NavLink>
        <NavLink to="/cart" className="header__nav-link header__cart">
          Cart
          <span className="header__cart-badge" aria-label="items in cart">
            {itemCount}
          </span>
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
