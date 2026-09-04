import { type BetterAuthOptions } from 'better-auth'
import { Effect } from 'effect'
import { type BetterAuthApiError } from './errors.js'
import { type ApiFull, type Service, type Tag } from './types.js'

/**
 * Every `Set-Cookie` on `headers` as `name=value` pairs, attributes
 * stripped. Sign-up and session rotations can set more than one cookie;
 * keeping every pair (not just the first header) is the whole point.
 */
export const cookiePairs = (headers: Headers): Array<string> =>
	headers
		.getSetCookie()
		.map((cookie) => cookie.split(';', 1)[0] ?? '')
		.filter((pair) => pair !== '')

/** Joins cookie pairs into a `cookie` request-header value. */
export const cookieHeader = (pairs: Iterable<string>): string =>
	[...pairs].join('; ')

/**
 * Merges cookie groups, last write wins per cookie name: a later session
 * rotation replaces its own token while unrelated cookies survive. Order
 * follows first appearance.
 */
export const mergeCookiePairs = (
	...groups: Array<Iterable<string>>
): Array<string> => {
	const latest = new Map<string, string>()
	for (const group of groups) {
		for (const pair of group) {
			const eq = pair.indexOf('=')
			if (eq === -1) {
				latest.set(pair, pair)
			} else {
				latest.set(pair.slice(0, eq), pair)
			}
		}
	}
	return [...latest.values()]
}

/**
 * What `signUpSession` hands back: three projections of one cookie jar —
 * `headers` for endpoint calls, `cookieHeader` ready to splice into a
 * request header, `cookiePairs` for `mergeCookiePairs` rotations. Deliberate
 * convenience: the kit computes them so the live suite does not have to.
 */
export type SignUpSession = {
	readonly userId: string
	/** A `Headers` whose cookie jar carries the sign-up session. */
	readonly headers: Headers
	/** The same cookies as a `cookie` header value. */
	readonly cookieHeader: string
	/** The cookies as `name=value` pairs, for `mergeCookiePairs` rotations. */
	readonly cookiePairs: Array<string>
}

/** The `full` surface's `signUpEmail` member, as the kit consumes it. */
type SignUpEmail = (options: {
	body: { email: string; name: string; password: string }
}) => Effect.Effect<
	{
		readonly headers: Headers
		readonly response: { readonly user: { readonly id: string } }
	},
	BetterAuthApiError
>

/**
 * SAFETY: `signUpEmail` is a core endpoint of every better-auth instance,
 * but inside a generic helper `Instance<O>['api']` collapses to the
 * unresolved plugin-inferred surface, so the access cannot be proven for an
 * unresolved `O`. The runtime proxy resolves it; the cast lives here, once
 * — the kit's only one.
 */
const signUpEmailOf = <O extends BetterAuthOptions>(
	full: ApiFull<O>
): SignUpEmail =>
	// oxlint-disable-next-line effect/noAs, typescript/no-unsafe-type-assertion -- core endpoint across a generic-Instance boundary
	(full as { signUpEmail: SignUpEmail }).signUpEmail

/**
 * Sign a user up over email + password and capture the session cookie the
 * response sets — the one flow every live suite needs. Built on the `full`
 * surface (`returnHeaders` is what carries the cookies); fails with
 * `BetterAuthApiError` like any other effectful call. Requires
 * `emailAndPassword: { enabled: true }` on the instance.
 *
 * A sign-up that sets no cookie is a broken fixture, not a recoverable
 * outcome — it dies, failing exactly the test that used it.
 */
export const signUpSession = <O extends BetterAuthOptions>(
	tag: Tag<O>,
	options: {
		readonly email: string
		readonly password: string
		readonly name?: string | undefined
	}
): Effect.Effect<SignUpSession, BetterAuthApiError, Service<O>> =>
	Effect.flatMap(tag, ({ full }) =>
		Effect.flatMap(
			signUpEmailOf(full)({
				body: {
					email: options.email,
					name: options.name ?? options.email,
					password: options.password
				}
			}),
			({ headers, response }) => {
				const pairs = cookiePairs(headers)
				if (pairs.length === 0) {
					return Effect.die(
						`sign-up produced no session cookie for ${options.email}`
					)
				}
				const jar = cookieHeader(pairs)
				return Effect.succeed({
					userId: response.user.id,
					headers: new Headers({ cookie: jar }),
					cookieHeader: jar,
					cookiePairs: pairs
				})
			}
		)
	)
