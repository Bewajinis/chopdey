import {
  loginUser as loginWithFirebase,
  logoutUser as logoutWithFirebase,
  registerUser as registerWithFirebase,
} from '../../services/authService'

export interface AuthCredentials {
  email: string
  password: string
}

export function validateAuthInput(
  email: string,
  password: string,
): AuthCredentials {
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail) {
    throw new Error('Email is required.')
  }

  if (!password) {
    throw new Error('Password is required.')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.')
  }

  return { email: normalizedEmail, password }
}

export async function register(email: string, password: string): Promise<void> {
  const credentials = validateAuthInput(email, password)
  await registerWithFirebase(credentials.email, credentials.password)
}

export async function login(email: string, password: string): Promise<void> {
  const credentials = validateAuthInput(email, password)
  await loginWithFirebase(credentials.email, credentials.password)
}

export async function logout(): Promise<void> {
  await logoutWithFirebase()
}
