import { describe, expect, it } from 'vitest'
import { validateAuthInput } from './AuthModel'

describe('validateAuthInput', () => {
  it('normalizes email and accepts valid credentials', () => {
    expect(validateAuthInput('  User@Example.com  ', 'secret1')).toEqual({
      email: 'user@example.com',
      password: 'secret1',
    })
  })

  it('requires an email', () => {
    expect(() => validateAuthInput('   ', 'secret1')).toThrow(
      'Email is required.',
    )
  })

  it('requires a password', () => {
    expect(() => validateAuthInput('user@example.com', '')).toThrow(
      'Password is required.',
    )
  })

  it('requires a password of at least 6 characters', () => {
    expect(() => validateAuthInput('user@example.com', '12345')).toThrow(
      'Password must be at least 6 characters.',
    )
  })
})
