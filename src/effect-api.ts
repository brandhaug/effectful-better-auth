import { isAPIError } from 'better-auth/api'
import { Effect, Option } from 'effect'
import { CurrentHeaders } from './current-headers.js'
import { BetterAuthApiError } from './errors.js'

/**
 * Makes the endpoint context's `headers` property optional so a call may
 * omit it and rely on ambient `CurrentHeaders` injection (or genuinely need
 * none). Every other property — and explicit per-call headers — is unchanged.
 */
type RelaxHeaders<C> =
	C extends Record<string, unknown>
		? C extends { headers: infer H }
			? Omit<C, 'headers'> & { headers?: H | undefined }
			: C
		: C

/**
 * Pins `returnHeaders` to `true` on the endpoint context: the `full`
 * surface (below) injects the flag at runtime, so the type only admits
 * omitting it or passing `true` — a `false` would break the result's
 * contract.
 */
type WithReturnHeaders<C> =
	C extends Record<string, unknown>
		? Omit<C, 'returnHeaders'> & { returnHeaders?: true | undefined }
		: C

/**
 * Maps every promise-returning endpoint of `auth.api` to an Effect failing
 * with `BetterAuthApiError` (SPEC §3). Non-function members are dropped.
 *
 * The generic `asResponse`/`returnHeaders` flags collapse to the data
 * branch under this mapped type; the raw instance is the escape hatch for
 * consumers needing the raw `Response`.
 */
export type EffectApi<Api> = {
	readonly [
		K in keyof Api as Api[K] extends (
			...args: Array<never>
		) => Promise<infer _R>
			? K
			: never
	]: Api[K] extends (...args: infer P) => Promise<infer R>
		? (
				...args: { readonly [I in keyof P]: RelaxHeaders<P[I]> }
			) => Effect.Effect<R, BetterAuthApiError>
		: never
}

/**
 * The `full` surface of an `auth.api`: `EffectApi`'s endpoints with
 * `returnHeaders` pinned, so each call resolves with the endpoint data AND
 * the response `headers` better-auth set — the `Set-Cookie` session
 * rotations, state cookies, and WebAuthn challenge cookies the data-only
 * proxy cannot carry (SPEC §3). Derived from `EffectApi` rather than
 * re-filtering `Api`, so the two surfaces share one endpoint filter and one
 * `RelaxHeaders` application — they cannot drift apart.
 */
export type FullApi<Api> = {
	readonly [K in keyof EffectApi<Api>]: EffectApi<Api>[K] extends (
		...args: infer P
	) => Effect.Effect<infer R, BetterAuthApiError>
		? (
				...args: { readonly [I in keyof P]: WithReturnHeaders<P[I]> }
			) => Effect.Effect<
				{ readonly headers: Headers; readonly response: R },
				BetterAuthApiError
			>
		: never
}

/**
 * Copies the call's argument list with the endpoint options bag amended: a
 * missing or null bag is created fresh, a non-object first argument (never
 * an options bag) passes through untouched, and an existing bag is copied
 * so the amend decides precedence.
 */
const amendOptions = (
	args: ReadonlyArray<unknown>,
	amend: (options: Record<string, unknown>) => Record<string, unknown>
): ReadonlyArray<unknown> => {
	const [input] = args
	if (input === undefined || input === null) {
		return [amend({}), ...args.slice(1)]
	}
	if (typeof input !== 'object') {
		return args
	}
	return [amend({ ...input }), ...args.slice(1)]
}

/**
 * Copies the call's argument list with the ambient `CurrentHeaders` merged
 * into the endpoint options. Explicit per-call headers win: a bag that
 * already carries `headers` passes through untouched.
 */
const injectAmbientHeaders = (
	args: ReadonlyArray<unknown>,
	headers: Headers
): ReadonlyArray<unknown> => {
	const [input] = args
	if (input !== null && typeof input === 'object' && 'headers' in input) {
		return args
	}
	return amendOptions(args, (options) => ({ ...options, headers }))
}

/**
 * Copies the call's argument list with `returnHeaders: true` set on the
 * endpoint options, so better-auth resolves the promise with
 * `{ headers, response }` instead of the data alone.
 */
const injectReturnHeaders = (
	args: ReadonlyArray<unknown>
): ReadonlyArray<unknown> =>
	amendOptions(args, (options) => ({ ...options, returnHeaders: true }))

/**
 * Adapts a single `auth.api` endpoint into a lazy Effect (SPEC §3):
 * `isAPIError` throws become typed `BetterAuthApiError` failures; anything
 * else is a bug or misconfiguration and dies. When `CurrentHeaders` is in
 * context and the call omits `headers`, the ambient headers are injected
 * before `transform` sees the arguments (the `full` surface appends
 * `returnHeaders: true` there). A non-function member resolves to
 * `undefined`, matching the mapped surfaces which drop non-function members.
 */
const toEffect = (
	endpoint: unknown,
	transform?: (args: ReadonlyArray<unknown>) => ReadonlyArray<unknown>
):
	| ((...args: Array<unknown>) => Effect.Effect<unknown, BetterAuthApiError>)
	| undefined => {
	if (typeof endpoint !== 'function') {
		return
	}
	return (...args: Array<unknown>) =>
		Effect.flatMap(Effect.serviceOption(CurrentHeaders), (ambient) =>
			Effect.tryPromise({
				try: () => {
					const withAmbient = Option.match(ambient, {
						onNone: () => args,
						onSome: (headers) => injectAmbientHeaders(args, headers)
					})
					if (transform === undefined) {
						return endpoint(...withAmbient)
					}
					return endpoint(...transform(withAmbient))
				},
				// Identity mapper: `tryPromise` would otherwise wrap the throw as a
				// `Cause.UnknownError`; keeping the raw value lets `isAPIError` below
				// discriminate on the original object.
				catch: (error) => error
			})
		).pipe(
			Effect.catch((error) => {
				if (isAPIError(error)) {
					return Effect.fail(
						new BetterAuthApiError({
							statusCode: error.statusCode,
							code: error.body?.code,
							message: error.message,
							headers: error.headers,
							cause: error
						})
					)
				}
				return Effect.die(error)
			})
		)
}

/**
 * The one runtime `Proxy` shell both surfaces share (SPEC §3): string
 * function members adapt through `toEffect` (with the surface's argument
 * transform, if any); anything else resolves to `undefined`, matching the
 * mapped types which drop non-function members. Plugin endpoints get
 * effectful support with zero per-plugin code.
 */
const proxyApi = <Api extends Record<string, unknown>>(
	api: Api,
	transform?: (args: ReadonlyArray<unknown>) => ReadonlyArray<unknown>
): Api =>
	new Proxy(api, {
		get: (target, prop) => {
			if (typeof prop !== 'string') {
				return
			}
			return toEffect(target[prop], transform)
		}
	})

/**
 * Wraps `auth.api` in the shared runtime proxy: every endpoint as an
 * Effect failing with `BetterAuthApiError` (SPEC §3).
 */
export const effectApi = <Api extends Record<string, unknown>>(
	api: Api
): EffectApi<Api> =>
	// SAFETY: a runtime Proxy over a third-party object cannot be proven to BE its
	// mapped type — `satisfies` has no answer for a value manufactured at runtime.
	// `effectApi` and `fullApi` are the library's only such boundaries, both built
	// on the one `proxyApi` shell; each wrapper owns its cast.
	// oxlint-disable-next-line effect/noAs, typescript/no-unsafe-type-assertion -- the proxy's mapped EffectApi surface is only expressible as a cast
	proxyApi(api) as EffectApi<Api>

/**
 * The `full` twin of `effectApi`: same proxy, same error policy, but every
 * call injects `returnHeaders: true` so the Effect resolves with
 * `{ headers, response }` — cookies and all (see `FullApi`).
 */
export const fullApi = <Api extends Record<string, unknown>>(
	api: Api
): FullApi<Api> =>
	// SAFETY: same boundary as `effectApi` — the mapped `FullApi` surface of the
	// shared runtime proxy is only expressible as a cast.
	// oxlint-disable-next-line effect/noAs, typescript/no-unsafe-type-assertion -- the proxy's mapped FullApi surface is only expressible as a cast
	proxyApi(api, injectReturnHeaders) as FullApi<Api>
