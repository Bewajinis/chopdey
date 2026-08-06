import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import HomeView from './pages/Home/HomeView'
import VenueView from './pages/Venue/VenueView'
import SearchView from './pages/Search/SearchView'
import FavouritesView from './pages/Favourites/FavouritesView'
import OrdersView from './pages/Orders/OrdersView'
import CartView from './pages/Cart/CartView'
import AuthView from './pages/Auth/AuthView'
import NotFoundView from './pages/NotFound/NotFoundView'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/venue/:id" element={<VenueView />} />
        <Route path="/search" element={<SearchView />} />
        <Route path="/favourites" element={<FavouritesView />} />
        <Route path="/orders" element={<OrdersView />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/auth" element={<AuthView />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
