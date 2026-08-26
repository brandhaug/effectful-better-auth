import { Effect, Exit } from 'effect'
import { describe, expect, it } from 'bun:test'
import { BetterAuthApiError } from '../src/index.js'

describe('BetterAuthApiError', () => {
  it('carries statusCode, code, message and headers', () => {
    const err = new BetterAuthApiError({
      statusCode: 401,
      code: 'INVALID_EMAIL_OR_PASSWORD',
      message: 'Invalid email or password',
      headers: { 'x-request-id': 'abc' }
    })
    expect(err._tag).toBe('BetterAuthApiError')
    expect(err.statusCode).toBe(401)
    expect(err.code).toBe('INVALID_EMAIL_OR_PASSWORD')
    expect(err.message).toBe('Invalid email or password')
    expect(err.headers).toEqual({ 'x-request-id': 'abc' })
  })

  it('allows code to be undefined', () => {
    const err = new BetterAuthApiError({
      statusCode: 500,
      code: undefined,
      message: 'boom',
      headers: {}
    })
    expect(err.code).toBeUndefined()
  })

  it('is an Error and fails an Effect as a typed tagged error', () => {
    const err = new BetterAuthApiError({
      statusCode: 404,
      code: 'USER_NOT_FOUND',
      message: 'User not found',
      headers: {}
    })
    expect(err).toBeInstanceOf(Error)
    const exit = Effect.runSyncExit(Effect.fail(err))
    expect(Exit.isFailure(exit)).toBe(true)
    const recovered = Effect.runSync(
      Effect.fail(err).pipe(
        Effect.catchTag('BetterAuthApiError', (e) =>
          Effect.succeed(e.statusCode)
        )
      )
    )
    expect(recovered).toBe(404)
  })
})
