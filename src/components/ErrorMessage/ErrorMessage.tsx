import './ErrorMessage.css'

interface ErrorMessageProps {
  error: string
}

function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <p className="error-message__text">{error}</p>
    </div>
  )
}

export default ErrorMessage
