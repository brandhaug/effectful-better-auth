import { APIError } from 'better-auth/api'
import { memoryAdapter } from 'better-auth/adapters/memory'
import { Effect, FileSystem, Layer, Option, Path, Schema } from 'effect'
import { Etag, HttpPlatform, HttpRouter } from 'effect/unstable/http'
import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup
} from 'effect/unstable/httpapi'
import { describe, expect, it } from 'bun:test'
import {
  effectApi,
  make,
  route,
  service,
  sessionMiddleware,
  type Api
} from '../src/index.js'

const freshDb = () => ({ user: [], session: [], account: [], verification: [] })

const secret = 'test-secret-at-least-32-characters-long'

const baseOptions = () => ({
  secret,
  baseURL: 'http://localhost:3000',
  emailAndPassword: { enabled: true },
  database: memoryAdapter(freshDb())
})

const PlatformLive = Layer.mergeAll(
  Path.layer,
  Etag.layer,
  FileSystem.layerNoop({}),
  HttpPlatform.layer.pipe(Layer.provide(FileSystem.layerNoop({})))
)

/**
 * One app per test id: auth routes mounted next to a minimal HttpApi with
 * one endpoint per middleware variant, plus a second middleware instance
 * carrying the cookie-cache flags and a spy recording what reaches the
 * underlying `api.getSession`.
 */
const makeApp = async (id: string, spy?: { throwOnGetSession?: boolean }) => {
  const options = baseOptions()
  const Auth = service(`${id}/Auth`, options)
  const instance = await Effect.runPromise(make(options))
  type GetSessionInput = NonNullable<Parameters<typeof instance.api.getSession>[0]>
  const getSessionCalls: Array<{ query?: GetSessionInput['query'] }> = []
  const spiedApi = {
    ...instance.api,
    getSession: (input: GetSessionInput) => {
      getSessionCalls.push({ query: input.query })
      if (spy?.throwOnGetSession) {
        throw new APIError(500, { code: 'FAILED_TO_GET_SESSION', message: 'boom' })
      }
      return instance.api.getSession(input)
    }
  }
  // The spied api is a test double over the raw endpoint map: overriding one member with
  // a plain function cannot reproduce the mapped `Api` type member-for-member, so the
  // double asserts itself back onto the library's surface exactly once, here.
  const authLayer = Layer.succeed(Auth.Tag)({
    // oxlint-disable-next-line effect/noAs, typescript/no-unsafe-type-assertion -- test double over the raw api endpoint map
    api: effectApi(spiedApi) as Api<typeof options>,
    instance
  })

  const AuthSession = sessionMiddleware(`${id}/Session`, Auth.Tag)
  const Fresh = sessionMiddleware(`${id}/Fresh`, Auth.Tag, {
    disableCookieCache: true,
    disableRefresh: true
  })

  const api = HttpApi.make(id)
    .add(
      HttpApiGroup.make('protected')
        .add(HttpApiEndpoint.get('me', '/me', { success: Schema.String }))
        .middleware(AuthSession.CurrentSession)
    )
    .add(
      HttpApiGroup.make('optional')
        .add(HttpApiEndpoint.get('who', '/who', { success: Schema.String }))
        .middleware(AuthSession.CurrentSessionOption)
    )
    .add(
      HttpApiGroup.make('fresh')
        .add(HttpApiEndpoint.get('fresh', '/fresh', { success: Schema.String }))
        .middleware(Fresh.CurrentSessionOption)
    )

  const groups = Layer.mergeAll(
    HttpApiBuilder.group(api, 'protected', (handlers) =>
      handlers.handle('me', () =>
        Effect.gen(function* () {
          const session = yield* AuthSession.Session
          return session.user.email
        })
      )
    ),
    HttpApiBuilder.group(api, 'optional', (handlers) =>
      handlers.handle('who', () =>
        Effect.gen(function* () {
          const session = yield* AuthSession.SessionOption
          return Option.match(session, {
            onNone: () => 'anonymous',
            onSome: (s) => s.user.email
          })
        })
      )
    ),
    HttpApiBuilder.group(api, 'fresh', (handlers) =>
      handlers.handle('fresh', () => Effect.succeed('fresh'))
    )
  )

  const layer = Layer.mergeAll(
    HttpApiBuilder.layer(api).pipe(
      Layer.provide(groups),
      Layer.provide(AuthSession.layer),
      Layer.provide(Fresh.layer)
    ),
    route(Auth.Tag)
  ).pipe(Layer.provide(authLayer), Layer.provide(PlatformLive))

  const { handler, dispose } = HttpRouter.toWebHandler(layer, { disableLogger: true })

  const signUp = async (email: string) => {
    const response = await handler(
      new Request('http://localhost:3000/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'Demo', email, password: 'password123' })
      })
    )
    expect(response.status).toBe(200)
    return response.headers.get('set-cookie') ?? ''
  }

  return { handler, dispose, signUp, getSessionCalls }
}

describe('sessionMiddleware', () => {
  it('a signed-in cookie reaches the handler with the typed session (required)', async () => {
    const app = await makeApp('mw-required')
    try {
      const cookie = await app.signUp('required@example.com')
      const response = await app.handler(
        new Request('http://localhost:3000/me', { headers: { cookie } })
      )
      expect(response.status).toBe(200)
      expect(await response.json()).toBe('required@example.com')
    } finally {
      await app.dispose()
    }
  })

  it('a missing cookie yields the Unauthorized contract error (required)', async () => {
    const app = await makeApp('mw-unauthorized')
    try {
      const response = await app.handler(new Request('http://localhost:3000/me'))
      expect(response.status).toBe(401)
      const body: { _tag: string } = await response.json()
      expect(body).toMatchObject({
        _tag: 'Unauthorized'
      })
    } finally {
      await app.dispose()
    }
  })

  it('the optional variant provides Option.none for a missing cookie', async () => {
    const app = await makeApp('mw-optional-none')
    try {
      const response = await app.handler(new Request('http://localhost:3000/who'))
      expect(response.status).toBe(200)
      expect(await response.json()).toBe('anonymous')
    } finally {
      await app.dispose()
    }
  })

  it('the optional variant provides Option.some for a signed-in cookie', async () => {
    const app = await makeApp('mw-optional-some')
    try {
      const cookie = await app.signUp('optional@example.com')
      const response = await app.handler(
        new Request('http://localhost:3000/who', { headers: { cookie } })
      )
      expect(response.status).toBe(200)
      expect(await response.json()).toBe('optional@example.com')
    } finally {
      await app.dispose()
    }
  })

  it('the cookie-cache flags reach getSession', async () => {
    const app = await makeApp('mw-flags')
    try {
      await app.handler(new Request('http://localhost:3000/fresh'))
      expect(app.getSessionCalls).toHaveLength(1)
      expect(app.getSessionCalls[0]?.query).toMatchObject({
        disableCookieCache: true,
        disableRefresh: true
      })

      await app.handler(new Request('http://localhost:3000/who'))
      expect(app.getSessionCalls).toHaveLength(2)
      expect(app.getSessionCalls[1]?.query).toMatchObject({
        disableCookieCache: false,
        disableRefresh: false
      })
    } finally {
      await app.dispose()
    }
  })

  it('session read failures pass through as BetterAuthApiError, untouched', async () => {
    const app = await makeApp('mw-transport', { throwOnGetSession: true })
    try {
      const response = await app.handler(new Request('http://localhost:3000/me'))
      expect(response.status).toBe(500)
      const body: { _tag: string } = await response.json()
      expect(body).toMatchObject({
        _tag: 'BetterAuthApiError',
        code: 'FAILED_TO_GET_SESSION'
      })
    } finally {
      await app.dispose()
    }
  })
})
