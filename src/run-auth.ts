import { type BetterAuthOptions } from 'better-auth'
import { Effect, type ManagedRuntime } from 'effect'
import { type Api, type Service, type Tag } from './types.js'

/**
 * Standalone convenience for server-side `auth.api.*` calls made outside the
 * Effect world (server functions, loaders, jobs): collapses the repeated
 * `runtime.runPromise(Effect.flatMap(Tag, …))` + rethrow boilerplate into a
 * single await.
 *
 * Resolves with the value built by `build`. Failures reject with the
 * underlying error **unwrapped**, so callers discriminate directly on
 * `BetterAuthApiError` `statusCode`/`code` — never `message` (SPEC §3).
 * Defects reject with the defect, per the runtime's own teardown.
 *
 * `headers` is forwarded to `build`, which threads it into endpoint inputs
 * (`api.getSession({ headers })`) — Better Auth reads cookies from there.
 *
 * The runtime must provide the auth service, e.g.
 * `ManagedRuntime.make(Auth.layer)` from the `service(...)` factory.
 */
export const runAuth = <O extends BetterAuthOptions, A, E>(options: {
  readonly tag: Tag<O>
  readonly runtime: ManagedRuntime.ManagedRuntime<Service<O>, unknown>
  readonly headers?: Headers | undefined
  readonly build: (
    api: Api<O>,
    headers: Headers | undefined
  ) => Effect.Effect<A, E>
}): Promise<A> =>
  options.runtime.runPromise(
    Effect.flatMap(options.tag, ({ api }) => options.build(api, options.headers))
  )
