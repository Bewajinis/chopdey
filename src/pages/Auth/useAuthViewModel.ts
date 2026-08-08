import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from './AuthModel'

export type AuthMode = 'login' | 'register'

export function useAuthViewModel() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleMode = useCallback(() => {
    setMode((current) => (current === 'login' ? 'register' : 'login'))
    setError(null)
  }, [])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      if (mode === 'register') {
        await register(email, password)
      } else {
        await login(email, password)
      }

      setPassword('')
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }, [email, password, mode, navigate])

  return {
    email,
    password,
    mode,
    loading,
    error,
    setEmail,
    setPassword,
    toggleMode,
    handleSubmit,
  }
}
