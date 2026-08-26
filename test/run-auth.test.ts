import { memoryAdapter } from 'better-auth/adapters/memory'
import { Effect, ManagedRuntime } from 'effect'
import { afterAll, describe, expect, it } from 'bun:test'
import { BetterAuthApiError, runAuth, service } from '../src/index.js'

const freshDb = () => ({ user: [], session: [], account: [], verification: [] })

const secret = 'test-secret-at-least-32-characters-long'

const Auth = service('test/run-auth/Auth', {
  secret,
  baseURL: 'http://localhost:3000',
  emailAndPassword: { enabled: true },
  database: memoryAdapter(freshDb())
})

const runtime = ManagedRuntime.make(Auth.layer)

afterAll(() => runtime.dispose())

describe('runAuth', () => {
  it('resolves the value built from the effectful api', async () => {
    const email = await runAuth({
      tag: Auth.Tag,
      runtime,
      build: (api) =>
        Effect.gen(function* () {
          const signedUp = yield* api.signUpEmail({
            body: {
              name: 'Demo',
              email: 'demo@example.com',
              password: 'password123'
            }
          })
          return signedUp.user.email
        })
    })
    expect(email).toBe('demo@example.com')
  })

  it('rethrows the failure unwrapped so callers can discriminate on it', async () => {
    const error = await runAuth({
      tag: Auth.Tag,
      runtime,
      build: (api) =>
        api.signInEmail({
          body: { email: 'nobody@example.com', password: 'wrong-password' }
        })
    }).then(
      () => {
        throw new Error('expected runAuth to reject')
      },
      (e) => e
    )
    expect(error).toBeInstanceOf(BetterAuthApiError)
    expect(error.statusCode).toBe(401)
    expect(error.code).toBe('INVALID_EMAIL_OR_PASSWORD')
  })

  it('forwards headers into the endpoint calls', async () => {
    const instance = await runtime.runPromise(
      Effect.map(Auth.Tag, (auth) => auth.instance)
    )
    const signedIn = await instance.api.signInEmail({
      body: { email: 'demo@example.com', password: 'password123' },
      returnHeaders: true
    })
    const cookie = signedIn.headers
      .getSetCookie()
      .map((c) => c.split(';')[0])
      .join('; ')
    const session = await runAuth({
      tag: Auth.Tag,
      runtime,
      headers: new Headers({ cookie }),
      build: (api, headers) =>
        api.getSession({ headers: headers ?? new Headers() })
    })
    expect(session?.user.email).toBe('demo@example.com')
  })

  it('a missing cookie yields null — no session, no error', async () => {
    const session = await runAuth({
      tag: Auth.Tag,
      runtime,
      build: (api, headers) =>
        api.getSession({ headers: headers ?? new Headers() })
    })
    expect(session).toBeNull()
  })
})
