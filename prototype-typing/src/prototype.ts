/**
 * THROWAWAY PROTOTYPE — wayfinder ticket #6.
 *
 * Question: can a factory return a tag/layer/call-helper that preserves the
 * consumer's plugin-inferred `typeof betterAuth(options)` — so that
 * `auth.api.listUsers` (admin plugin) and `auth.api.signInUsername`
 * (username plugin) typecheck through the service, and are ABSENT without
 * the plugins?
 *
 * Verdict comes from `bun run typecheck`: the positive assertions must
 * compile, the `@ts-expect-error` negative assertions must stay errors.
 * `bun run declaration` probes the TS4023 re-export risk (see reexport.ts).
 */
import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { admin } from 'better-auth/plugins/admin'
import { username } from 'better-auth/plugins/username'
import { Context, Effect, Layer, Schema } from 'effect'

// ---------------------------------------------------------------------------
// Shared library-side bits
// ---------------------------------------------------------------------------

export class BetterAuthApiError extends Schema.TaggedErrorClass<BetterAuthApiError>(
  'BetterAuthApiError'
)('BetterAuthApiError', {
  status: Schema.Union([Schema.String, Schema.Number]),
  message: Schema.String
}) {}

// The instance type Better Auth infers from a concrete options object.
type InstanceOf<O extends BetterAuthOptions> = ReturnType<typeof betterAuth<O>>

// ---------------------------------------------------------------------------
// Pattern A — generic `make`; the CONSUMER owns the tag
// ---------------------------------------------------------------------------

export const make = <const O extends BetterAuthOptions>(
  options: O
): Effect.Effect<InstanceOf<O>> => Effect.sync(() => betterAuth(options))

// Consumer side:
const optionsA = {
  secret: 'proto-secret',
  baseURL: 'http://localhost:9999',
  emailAndPassword: { enabled: true },
  plugins: [username(), admin({ adminRoles: ['admin'] })]
} satisfies BetterAuthOptions

class AuthA extends Context.Service<AuthA, InstanceOf<typeof optionsA>>()(
  'proto/AuthA'
) {}

const AuthALive = Layer.effect(AuthA)(make(optionsA))

// ---------------------------------------------------------------------------
// Pattern B — factory returning { Tag, layer, call }; the LIBRARY mints the tag
// ---------------------------------------------------------------------------

export const service = <const O extends BetterAuthOptions>(id: string, options: O) => {
  const Tag = Context.Service<InstanceOf<O>>(id)
  const layer = Layer.sync(Tag)(() => betterAuth(options))
  const call = <A>(f: (api: InstanceOf<O>['api']) => Promise<A>) =>
    Effect.gen(function* () {
      const auth = yield* Tag
      return yield* Effect.tryPromise({
        try: () => f(auth.api),
        catch: (cause) =>
          new BetterAuthApiError({ status: 500, message: String(cause) })
      })
    })
  return { Tag, layer, call } as const
}

// Consumer side:
const AuthB = service('proto/AuthB', {
  secret: 'proto-secret',
  baseURL: 'http://localhost:9999',
  emailAndPassword: { enabled: true },
  plugins: [username(), admin({ adminRoles: ['admin'] })]
})

// ---------------------------------------------------------------------------
// Assertions — the actual prototype output
// ---------------------------------------------------------------------------

// A1: admin-plugin endpoint is present and fully typed through the consumer tag.
const a1 = Effect.gen(function* () {
  const auth = yield* AuthA
  const { users } = yield* Effect.promise(() =>
    auth.api.listUsers({ query: { limit: 10 } })
  )
  return users
})

// A2: username-plugin endpoint present, body typed.
const a2 = Effect.gen(function* () {
  const auth = yield* AuthA
  return yield* Effect.promise(() =>
    auth.api.signInUsername({ body: { username: 'demo', password: 'pw' } })
  )
})

// B1: same endpoints through the factory's `call` helper; error channel must
// be exactly BetterAuthApiError (compile-time check via conditional type).
const b1 = AuthB.call((api) => api.listUsers({ query: { limit: 10 } }))
type B1Error = typeof b1 extends Effect.Effect<infer _A, infer E, infer _R> ? E : never
const _b1ErrorIsTagged: B1Error extends BetterAuthApiError ? true : never = true
const _b1ResultTyped: Effect.Success<typeof b1> extends { users: unknown[] }
  ? true
  : never = true

const b2 = AuthB.call((api) =>
  api.signInUsername({ body: { username: 'demo', password: 'pw' } })
)

// N1: WITHOUT plugins, the plugin endpoints must not exist.
const bare = service('proto/AuthBare', {
  secret: 'proto-secret',
  baseURL: 'http://localhost:9999',
  emailAndPassword: { enabled: true }
})

// @ts-expect-error listUsers comes from the admin plugin; bare instance must lack it
const n1 = bare.call((api) => api.listUsers({ query: { limit: 10 } }))

// @ts-expect-error signInUsername comes from the username plugin
const n2 = bare.call((api) => api.signInUsername({ body: { username: 'x', password: 'y' } }))

// N2: misspelled body fields must stay errors through the factory.
// @ts-expect-error `usernam` is not a valid body key
const n3 = AuthB.call((api) => api.signInUsername({ body: { usernam: 'demo', password: 'pw' } }))

export const exports_ = { a1, a2, b1, b2, n1, n2, n3, AuthALive, _b1ErrorIsTagged, _b1ResultTyped }
