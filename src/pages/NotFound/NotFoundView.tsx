import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFoundView() {
  return (
    <main className="page not-found">
      <h1 className="not-found__code">404</h1>
      <p className="not-found__message">
        This page doesn&apos;t exist — but good food does.
      </p>
      <Link to="/" className="not-found__link">
        Back to Home
      </Link>
    </main>
  )
}

export default NotFoundView
