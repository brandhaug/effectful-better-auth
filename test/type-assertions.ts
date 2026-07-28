/**
 * Type-level assertions, checked by `bun run typecheck` (tsc --noEmit).
 * Ported from the validated prototype (prototype/typing-strategy branch).
 * Positive cases must compile; `@ts-expect-error` cases must stay errors.
 */
import { memoryAdapter } from 'better-auth/adapters/memory'
import { admin } from 'better-auth/plugins/admin'
import { username } from 'better-auth/plugins/username'
import { Context, Effect, Layer } from 'effect'
import { BetterAuthApiError, plugins, service, type ServiceResult, type Session } from '../src/index.js'

const secret = 'type-assertions-secret-32-characters'

const Auth = service('types/Auth', {
  secret,
  baseURL: 'http://localhost:3000',
  emailAndPassword: { enabled: true },
  database: memoryAdapter({}),
  plugins: [username(), admin({ adminRoles: ['admin'] })]
})

// T1: admin-plugin endpoint present and typed through the service.
const t1 = Effect.gen(function* () {
  const auth = yield* Auth.Tag
  const { users, total } = yield* auth.api.listUsers({ query: { limit: 10 } })
  return { users, total }
})

// T2: error channel is exactly BetterAuthApiError (mutual extends).
type T1Error = typeof t1 extends Effect.Effect<infer _A, infer E, infer _R> ? E : never
const _t1ErrorCovers: [T1Error] extends [BetterAuthApiError] ? true : never = true
const _t1ErrorExact: [BetterAuthApiError] extends [T1Error] ? true : never = true

// T3: username-plugin endpoint present, body typed; misspelled key rejected.
const t3 = Effect.gen(function* () {
  const auth = yield* Auth.Tag
  yield* auth.api.signInUsername({ body: { username: 'demo', password: 'pw' } })
  // @ts-expect-error `usernam` is not a valid body key
  yield* auth.api.signInUsername({ body: { usernam: 'demo', password: 'pw' } })
})

// T4: WITHOUT plugins, the plugin endpoints must not exist.
const Bare = service('types/Bare', {
  secret,
  baseURL: 'http://localhost:3000',
  emailAndPassword: { enabled: true },
  database: memoryAdapter({})
})
const t4 = Effect.gen(function* () {
  const auth = yield* Bare.Tag
  // @ts-expect-error listUsers comes from the admin plugin
  yield* auth.api.listUsers({ query: { limit: 10 } })
  // @ts-expect-error signInUsername comes from the username plugin
  yield* auth.api.signInUsername({ body: { username: 'x', password: 'y' } })
})

// T5: getSession keeps its `| null` result through the proxy.
const t5 = Effect.gen(function* () {
  const auth = yield* Auth.Tag
  const session = yield* auth.api.getSession({ headers: new Headers() })
  return session === null ? 'anonymous' : session.user.id
})
type T5Success = Effect.Success<typeof t5>
const _t5Null: null extends Effect.Success<
  ReturnType<Context.Service.Shape<typeof Auth.Tag>['api']['getSession']>
>
  ? true
  : never = true

// T6: an effectful options builder's requirements flow into the layer's R.
const Dep = Context.Service<{ readonly appSecret: string }>('types/Dep')
const Built = service(
  'types/Built',
  Effect.gen(function* () {
    const dep = yield* Dep
    return {
      secret: dep.appSecret,
      baseURL: 'http://localhost:3000',
      emailAndPassword: { enabled: true as const },
      database: memoryAdapter({})
    }
  })
)
type BuiltR = typeof Built extends ServiceResult<infer _O, infer _E, infer R> ? R : never
const _builtRequiresDep: [{ readonly appSecret: string }] extends [BuiltR] ? true : never =
  true
// Providing the dependency erases R.
const _provided: Layer.Layer<
  Context.Service.Shape<typeof Built.Tag>,
  never,
  never
> = Built.layer.pipe(Layer.provide(Layer.succeed(Dep)({ appSecret: secret })))

export const _exports = { t1, t3, t4, t5, _t1ErrorCovers, _t1ErrorExact, _t5Null, _builtRequiresDep, _provided }
export type { T5Success }

// T7 (regression): `Session<O>` must carry plugin schema fields. The admin
// plugin widens `user` with `role`; `$Infer.Session` does NOT see this —
// only the getSession endpoint's return type does, which is why Session<O>
// derives from the endpoint (see src/types.ts). The check must be
// `keyof`-based: `extends { role?: ... }` passes even when role is absent.
type AuthOptions = typeof Auth extends ServiceResult<infer O, infer _E, infer _R> ? O : never
type AuthSession = Session<AuthOptions>
const _t7RoleExists: 'role' extends keyof AuthSession['user'] ? true : never = true
const _t7SessionToken: AuthSession['session'] extends { token: string } ? true : never = true

// T8 (regression): options built in a function widen the plugins array to a
// union array, which drops plugin schema inference entirely — unless the
// array goes through the `plugins(...)` tuple helper.
const makeOptionsInFn = () => ({
  secret,
  baseURL: 'http://localhost:3000',
  emailAndPassword: { enabled: true },
  database: memoryAdapter({}),
  plugins: plugins(username(), admin({ adminRoles: ['admin'] }))
})
type FnSession = Session<ReturnType<typeof makeOptionsInFn>>
const _t8RoleSurvivesFn: 'role' extends keyof FnSession['user'] ? true : never = true
