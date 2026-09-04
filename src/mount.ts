import { type BetterAuthOptions } from 'better-auth'
import { Effect, type Layer } from 'effect'
import {
	HttpRouter,
	type HttpServerError,
	HttpServerRequest,
	HttpServerResponse
} from 'effect/unstable/http'
import { type Service, type Tag } from './types.js'

/**
 * Primitive mount (SPEC §4): a plain v4 HTTP effect forwarding the incoming
 * request to better-auth's own handler. better-auth resolves errors as
 * `Response`s, so a rejected handler promise is a bug and dies (§3);
 * responses — streaming bodies included — pass through `fromWeb` untouched.
 *
 * File-route consumers materialize this with `HttpEffect.toWebHandler`.
 */
export const toHttpEffect = <O extends BetterAuthOptions>(
	tag: Tag<O>
): Effect.Effect<
	HttpServerResponse.HttpServerResponse,
	HttpServerError.RequestError,
	HttpServerRequest.HttpServerRequest | Service<O>
> =>
	Effect.gen(function* () {
		const auth = yield* tag
		const request = yield* HttpServerRequest.HttpServerRequest
		const webRequest = yield* HttpServerRequest.toWeb(request)
		const response = yield* Effect.promise(() =>
			auth.instance.handler(webRequest)
		)
		return HttpServerResponse.fromWeb(response)
	})

/**
 * Web-standard mount (SPEC §4): a plain `Request` in, `Response` out effect.
 * Collapses the `fromWeb` → `toHttpEffect` → `toWeb` dance file-route
 * frameworks (TanStack Start and friends) repeated at every mount site —
 * including well-known paths (RFC 8414 discovery) that live outside the
 * catchall base path. The effect still requires only the auth service, so
 * it composes inside a larger request Effect (rate limiting, audit) or runs
 * on a `ManagedRuntime`. Streaming bodies pass through untouched.
 */
export const handleWebRequest = <O extends BetterAuthOptions>(
	tag: Tag<O>,
	request: Request
): Effect.Effect<Response, HttpServerError.RequestError, Service<O>> =>
	toHttpEffect(tag).pipe(
		Effect.provideService(
			HttpServerRequest.HttpServerRequest,
			HttpServerRequest.fromWeb(request)
		),
		Effect.map(HttpServerResponse.toWeb)
	)

/**
 * Convenience mount (SPEC §4): registers `'*' <basePath>/*` on the v4
 * singleton router. `basePath` derives from the instance's better-auth
 * options (`options.basePath ?? '/api/auth'`); an explicit override here is
 * the single override point. Middleware, rate limiting, and logging are the
 * consumer's composition — no hooks on the mount.
 *
 * The mount orDies `toHttpEffect`'s `RequestError`: a mounted route has no
 * error channel to answer it (the router serializes route failures), and a
 * request that fails web conversion is a defect, not a recoverable failure.
 * `toHttpEffect` keeps the typed error channel so standalone
 * `HttpEffect.toWebHandler` consumers can decide the policy themselves.
 */
export const route = <O extends BetterAuthOptions>(
	tag: Tag<O>,
	options?: { readonly basePath?: string }
): Layer.Layer<never, never, Service<O> | HttpRouter.HttpRouter> =>
	HttpRouter.use((router) =>
		Effect.gen(function* () {
			const auth = yield* tag
			const basePath =
				options?.basePath ?? auth.instance.options.basePath ?? '/api/auth'
			yield* router.add(
				'*',
				// SAFETY: the basePath is a user-supplied string while the router's PathInput
				// is a template literal type, so the splice to `/*` cannot be proven at the
				// type level. The mount owns this one conversion at its only boundary.
				// oxlint-disable-next-line effect/noAs, typescript/no-unsafe-type-assertion -- string-to-PathInput is the mount's runtime boundary
				`${basePath}/*` as HttpRouter.PathInput,
				toHttpEffect(tag).pipe(Effect.provideService(tag, auth), Effect.orDie)
			)
		})
	)
