import './Loader.css'

function Loader() {
  return (
    <div className="loader" role="status">
      <div className="loader__spinner" aria-hidden="true" />
      <p className="loader__text">Loading…</p>
    </div>
  )
}

export default Loader
