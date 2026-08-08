import { describe, expect, it } from 'vitest'
import { validateSearchQuery } from './SearchModel'

describe('validateSearchQuery', () => {
  it('accepts queries with at least 2 characters', () => {
    expect(validateSearchQuery('  jollof  ')).toBe('jollof')
  })

  it('rejects queries shorter than 2 characters', () => {
    expect(() => validateSearchQuery('x')).toThrow(
      'Enter at least 2 characters to search.',
    )
  })

  it('rejects empty queries', () => {
    expect(() => validateSearchQuery('   ')).toThrow(
      'Enter at least 2 characters to search.',
    )
  })
})
