import { betterAuth } from 'better-auth'
import { memoryAdapter } from 'better-auth/adapters/memory'
import { Effect } from 'effect'
import { describe, expect, it } from 'bun:test'
import { CurrentHeaders, effectApi } from '../src/index.js'

const makeAuth = () =>
  betterAuth({
    secret: 'test-secret-at-least-32-characters-long',
    baseURL: 'http://localhost:3000',
    emailAndPassword: { enabled: true },
    database: memoryAdapter({ user: [], session: [], account: [], verification: [] })
  })

const makeRecording = () => {
  const calls: Array<unknown> = []
  const api = effectApi({
    probe: (input?: unknown) => {
      calls.push(input)
      return Promise.resolve({ ok: true })
    }
  })
  return { api, calls }
}

describe('CurrentHeaders', () => {
  it('injects ambient headers when provided and the options omit headers', async () => {
    const { api, calls } = makeRecording()
    const ambient = new Headers({ 'x-ambient': 'yes' })
    await Effect.runPromise(
      api.probe({ query: { limit: 1 } }).pipe(Effect.provideService(CurrentHeaders, ambient))
    )
    expect(calls).toHaveLength(1)
    const input = calls[0] as { query?: unknown; headers?: Headers }
    expect(input.query).toEqual({ limit: 1 })
    expect(input.headers?.get('x-ambient')).toBe('yes')
  })

  it('injects ambient headers into a call made with no arguments', async () => {
    const { api, calls } = makeRecording()
    await Effect.runPromise(
      api.probe().pipe(Effect.provideService(CurrentHeaders, new Headers({ 'x-ambient': 'yes' })))
    )
    expect(calls).toHaveLength(1)
    expect((calls[0] as { headers?: Headers }).headers?.get('x-ambient')).toBe('yes')
  })

  it('explicit per-call headers win over ambient', async () => {
    const { api, calls } = makeRecording()
    const explicit = new Headers({ 'x-ambient': 'explicit' })
    await Effect.runPromise(
      Effect.provideService(
        api.probe({ headers: explicit }),
        CurrentHeaders,
        new Headers({ 'x-ambient': 'ambient' })
      )
    )
    expect(calls[0]).toMatchObject({ headers: explicit })
    expect((calls[0] as { headers: Headers }).headers.get('x-ambient')).toBe('explicit')
  })

  it('is a no-op when CurrentHeaders is not in context', async () => {
    const { api, calls } = makeRecording()
    const input = { query: { limit: 2 } }
    await Effect.runPromise(api.probe(input))
    expect(calls[0]).toBe(input)
  })

  it('flows ambient request headers into real auth.api calls', async () => {
    const auth = makeAuth()
    const api = effectApi(auth.api)
    const email = 'ambient@example.com'
    await Effect.runPromise(
      api.signUpEmail({
        body: {
          name: 'Demo',
          email,
          password: 'password123'
        }
      })
    )

    const response = await auth.api.signInEmail({
      body: { email, password: 'password123' },
      asResponse: true
    })
    const cookie = response.headers.getSetCookie().join('; ')
    expect(cookie.length).toBeGreaterThan(0)

    const session = await Effect.runPromise(
      Effect.provideService(
        api.getSession({}),
        CurrentHeaders,
        new Headers({ cookie })
      )
    )
    expect(session?.user.email).toBe(email)

    // Without ambient injection the call must arrive untouched: explicit
    // empty headers satisfy better-auth's requireHeaders, no cookie → null.
    const anonymous = await Effect.runPromise(
      api.getSession({ headers: new Headers() })
    )
    expect(anonymous).toBeNull()
  })
})
