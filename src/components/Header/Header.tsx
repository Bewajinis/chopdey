import { Link, NavLink } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header__top">
        <Link to="/" className="header__brand">
          ChopDey
        </Link>

        <form
          className="header__search"
          onSubmit={(e) => e.preventDefault()}
          role="search"
        >
          <input
            type="search"
            className="header__search-input"
            placeholder="Search for food…"
            aria-label="Search for food"
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
            0
          </span>
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
