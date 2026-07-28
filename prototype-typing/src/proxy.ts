/**
 * THROWAWAY PROTOTYPE — spec amendment probe (post ticket #6).
 *
 * Question: can an effectful `api` proxy replace the `call` combinator with
 * drizzle-like DX — `yield* auth.api.listUsers({...})` returning
 * `Effect<A, BetterAuthApiError>` — while preserving plugin-inferred input
 * and result types? And what happens to the generic `asResponse` /
 * `returnHeaders` flags under the mapped type?
 */
import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { isAPIError } from 'better-auth/api'
import { admin } from 'better-auth/plugins/admin'
import { username } from 'better-auth/plugins/username'
import { Context, Effect, Layer } from 'effect'
import { BetterAuthApiError } from './prototype.js'

type InstanceOf<O extends BetterAuthOptions> = ReturnType<typeof betterAuth<O>>

// ---------------------------------------------------------------------------
// The mapped type: every promise-returning endpoint becomes an Effect.
// Non-function members (if any) are dropped.
// ---------------------------------------------------------------------------

export type EffectApi<Api> = {
  readonly [K in keyof Api as Api[K] extends (...args: never[]) => Promise<unknown>
    ? K
    : never]: Api[K] extends (...args: infer P) => Promise<infer R>
    ? (...args: P) => Effect.Effect<R, BetterAuthApiError>
    : never
}

// Runtime: a Proxy so plugin endpoints need no per-plugin code. APIError →
// typed failure; anything else is a defect (Effect.die), per the taxonomy
// decision on ticket #7.
export const effectApi = <Api extends Record<string, unknown>>(
  api: Api
): EffectApi<Api> =>
  new Proxy({} as Record<string, unknown>, {
    get: (_target, prop) => {
      if (typeof prop !== 'string') return undefined
      return (...args: unknown[]) =>
        Effect.tryPromise({
          try: () => (api[prop] as (...a: unknown[]) => Promise<unknown>)(...args),
          catch: (cause) => cause
        }).pipe(
          Effect.catch((cause: unknown) =>
            isAPIError(cause)
              ? Effect.fail(
                  new BetterAuthApiError({
                    status: cause.statusCode,
                    message: cause.message
                  })
                )
              : Effect.die(cause)
          )
        )
    }
  }) as EffectApi<Api>

// ---------------------------------------------------------------------------
// The service shape the factory would provide: effectful api + raw instance
// as the escape hatch (asResponse / returnHeaders / handler).
// ---------------------------------------------------------------------------

export const wrap = <const O extends BetterAuthOptions>(options: O) => {
  const instance = betterAuth(options)
  return { api: effectApi(instance.api), instance } as const
}

const options = {
  secret: 'proto-secret',
  baseURL: 'http://localhost:9999',
  emailAndPassword: { enabled: true },
  plugins: [username(), admin({ adminRoles: ['admin'] })]
} satisfies BetterAuthOptions

class AuthP extends Context.Service<AuthP, ReturnType<typeof wrap<typeof options>>>()(
  'proto/AuthP'
) {}

export const AuthPLive = Layer.sync(AuthP)(() => wrap(options))

// ---------------------------------------------------------------------------
// Assertions
// ---------------------------------------------------------------------------

// P1: drizzle-style DX; admin-plugin endpoint typed end to end.
const p1 = Effect.gen(function* () {
  const auth = yield* AuthP
  const { users, total } = yield* auth.api.listUsers({ query: { limit: 10 } })
  return { users, total }
})
type P1Error = typeof p1 extends Effect.Effect<infer _A, infer E, infer _R> ? E : never
const _p1Error: P1Error extends BetterAuthApiError ? true : never = true

// P2: username-plugin endpoint; body typed.
const p2 = Effect.gen(function* () {
  const auth = yield* AuthP
  return yield* auth.api.signInUsername({ body: { username: 'demo', password: 'pw' } })
})

// P3: misspelled body key stays a compile error through the proxy.
const p3 = Effect.gen(function* () {
  const auth = yield* AuthP
  // @ts-expect-error `usernam` is not a valid body key
  return yield* auth.api.signInUsername({ body: { usernam: 'demo', password: 'pw' } })
})

// P4: plugin-less instance must lack plugin endpoints through the proxy.
const bare = wrap({
  secret: 'proto-secret',
  baseURL: 'http://localhost:9999',
  emailAndPassword: { enabled: true }
})
// @ts-expect-error listUsers comes from the admin plugin
const p4 = bare.api.listUsers({ query: { limit: 10 } })

// P5: getSession keeps its `| null` result through the proxy.
const p5 = Effect.gen(function* () {
  const auth = yield* AuthP
  const session = yield* auth.api.getSession({ headers: new Headers() })
  return session === null ? 'anonymous' : session.user.id
})

// P6 (observation, not a requirement): what do the generic ctx flags do under
// the mapped type? Record whether `asResponse: true` still changes the return
// type or collapses to the data branch — the raw instance is the intended
// escape hatch either way.
const p6 = Effect.gen(function* () {
  const auth = yield* AuthP
  const viaProxy = yield* auth.api.getSession({
    headers: new Headers(),
    asResponse: true
  })
  const viaRaw = yield* Effect.promise(() =>
    auth.instance.api.getSession({ headers: new Headers(), asResponse: true })
  )
  return { viaProxy, viaRaw }
})
type P6Proxy = Effect.Success<typeof p6>['viaProxy']
type P6Raw = Effect.Success<typeof p6>['viaRaw']
const _p6RawIsResponse: P6Raw extends Response ? true : false = true

export const exports_ = { p1, p2, p3, p4, p5, p6, _p1Error, _p6RawIsResponse }
export type { P6Proxy }
