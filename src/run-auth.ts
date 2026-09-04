import { type BetterAuthOptions } from 'better-auth'
import { Effect, type ManagedRuntime, Option } from 'effect'
import { CurrentHeaders } from './current-headers.js'
import { MissingRequestHeaders } from './errors.js'
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
 * `build` receives the effectful `api` and nothing else: `headers` is
 * provided as ambient `CurrentHeaders`, so `auth.api.*` calls inside
 * `build` that omit `headers` pick the cookie jar up automatically — no
 * per-call threading. Explicit per-call headers still win, and code needing
 * the raw `Headers` closes over the value passed here.
 *
 * `requireHeaders: true` flips a missing `headers` into a typed
 * `MissingRequestHeaders` rejection instead of letting the call proceed
 * with an empty cookie jar.
 *
 * The runtime must provide the auth service, e.g.
 * `ManagedRuntime.make(Auth.layer)` from the `service(...)` factory.
 */
export const runAuth = <O extends BetterAuthOptions, A, E>(options: {
	readonly tag: Tag<O>
	readonly runtime: ManagedRuntime.ManagedRuntime<Service<O>, unknown>
	readonly headers?: Headers | undefined
	readonly requireHeaders?: boolean | undefined
	readonly build: (api: Api<O>) => Effect.Effect<A, E>
}): Promise<A> => {
	if (options.requireHeaders === true && options.headers === undefined) {
		return options.runtime.runPromise(Effect.fail(new MissingRequestHeaders()))
	}
	const built = Effect.flatMap(options.tag, ({ api }) => options.build(api))
	// `headers` rides as ambient `CurrentHeaders` when present — one
	// pipeline from tag to promise either way.
	const withAmbient = Option.match(Option.fromNullishOr(options.headers), {
		onNone: () => built,
		onSome: (headers) =>
			built.pipe(Effect.provideService(CurrentHeaders, headers))
	})
	return options.runtime.runPromise(withAmbient)
}
