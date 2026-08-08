import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import { useAuthViewModel } from './useAuthViewModel'
import './AuthView.css'

function AuthView() {
  const {
    email,
    password,
    mode,
    loading,
    error,
    setEmail,
    setPassword,
    toggleMode,
    handleSubmit,
  } = useAuthViewModel()

  const isRegister = mode === 'register'

  return (
    <main className="page auth">
      <section className="auth__card">
        <h1 className="auth__title">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="auth__subtitle">
          {isRegister
            ? 'Sign up to save favourites and track orders.'
            : 'Log in to access your favourites and orders.'}
        </p>

        {error && <ErrorMessage error={error} />}

        <form
          className="auth__form"
          onSubmit={(event) => {
            event.preventDefault()
            handleSubmit()
          }}
        >
          <label className="auth__label">
            Email
            <input
              type="email"
              className="auth__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="auth__label">
            Password
            <input
              type="password"
              className="auth__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              minLength={6}
              required
            />
          </label>

          <button type="submit" className="auth__submit" disabled={loading}>
            {loading
              ? isRegister
                ? 'Creating account…'
                : 'Signing in…'
              : isRegister
                ? 'Create account'
                : 'Log in'}
          </button>
        </form>

        <button type="button" className="auth__toggle" onClick={toggleMode}>
          {isRegister
            ? 'Already have an account? Log in'
            : 'New here? Create an account'}
        </button>
      </section>
    </main>
  )
}

export default AuthView
