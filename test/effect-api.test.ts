import { betterAuth } from 'better-auth'
import { memoryAdapter } from 'better-auth/adapters/memory'
import { username } from 'better-auth/plugins/username'
import { Cause, Effect, Exit, Option } from 'effect'
import { describe, expect, it } from 'bun:test'
import { BetterAuthApiError, effectApi } from '../src/index.js'

const makeAuth = () =>
  betterAuth({
    secret: 'test-secret-at-least-32-characters-long',
    baseURL: 'http://localhost:3000',
    emailAndPassword: { enabled: true },
    database: memoryAdapter({ user: [], session: [], account: [], verification: [] }),
    plugins: [username()]
  })

describe('effectApi', () => {
  it('runs a successful endpoint as a succeeding Effect', async () => {
    const auth = makeAuth()
    const api = effectApi(auth.api)
    const result = await Effect.runPromise(
      api.signUpEmail({
        body: {
          name: 'Demo',
          email: 'demo@example.com',
          password: 'password123',
          username: 'demo'
        }
      })
    )
    expect(result.user.email).toBe('demo@example.com')
  })

  it('calls a plugin endpoint through the proxy', async () => {
    const auth = makeAuth()
    const api = effectApi(auth.api)
    const result = await Effect.runPromise(
      api
        .signUpEmail({
          body: {
            name: 'Demo',
            email: 'demo@example.com',
            password: 'password123',
            username: 'demo'
          }
        })
        .pipe(
          Effect.flatMap(() =>
            api.signInUsername({
              body: { username: 'demo', password: 'password123' }
            })
          )
        )
    )
    expect(result.user.email).toBe('demo@example.com')
  })

  it('fails with BetterAuthApiError carrying statusCode and code', async () => {
    const auth = makeAuth()
    const api = effectApi(auth.api)
    const exit = await Effect.runPromiseExit(
      api.signInEmail({
        body: { email: 'nobody@example.com', password: 'wrong-password' }
      })
    )
    expect(Exit.isFailure(exit)).toBe(true)
    if (Exit.isFailure(exit)) {
      const error = Option.getOrThrow(Cause.findErrorOption(exit.cause))
      expect(error).toBeInstanceOf(BetterAuthApiError)
      expect(error.statusCode).toBe(401)
      expect(error.code).toBe('INVALID_EMAIL_OR_PASSWORD')
      expect(error.cause).toBeInstanceOf(Error)
    }
  })

  it('treats a non-APIError throw as a defect, not a failure', async () => {
    const boom = new TypeError('not an APIError')
    const api = effectApi({
      broken: () => Promise.reject(boom)
    })
    const exit = await Effect.runPromiseExit(api.broken())
    expect(Exit.isFailure(exit)).toBe(true)
    if (Exit.isFailure(exit)) {
      expect(Cause.hasFails(exit.cause)).toBe(false)
      expect(Cause.hasDies(exit.cause)).toBe(true)
    }
  })
})
