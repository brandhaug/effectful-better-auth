import { memoryAdapter } from 'better-auth/adapters/memory'
import { Effect, ManagedRuntime } from 'effect'
import { describe, expect, it } from 'bun:test'
import {
	BetterAuthApiError,
	MissingRequestHeaders,
	runAuth,
	service
} from '../src/index.js'

const freshDb = () => ({ user: [], session: [], account: [], verification: [] })

const secret = 'test-secret-at-least-32-characters-long'

/**
 * A fresh service per runtime: the memory adapter stores its rows in the `db`
 * object passed to `memoryAdapter`, so two runtimes built from one module-level
 * `service(...)` would share a database. Building options inside the helper
 * keeps each runtime's better-auth instance (and its DB) fully isolated.
 */
const makeAuth = () =>
	service('test/run-auth/Auth', {
		secret,
		baseURL: 'http://localhost:3000',
		emailAndPassword: { enabled: true },
		database: memoryAdapter(freshDb())
	})

type AuthContext = ReturnType<typeof makeAuthRuntime>

/**
 * Per-test runtime: `bun:test` has no Effect scope integration, so each test
 * acquires its own service and runtime and disposes them on the way out — the
 * bun-native equivalent of Effect.acquireRelease. Returning both keeps the tag
 * and its runtime paired so `runAuth`'s `Service<O>` requirement lines up.
 */
const makeAuthRuntime = () => {
	const auth = makeAuth()
	const runtime = ManagedRuntime.make(auth.layer)
	return { auth, runtime }
}

const withRuntime = async <A>(
	run: (ctx: AuthContext) => Promise<A>
): Promise<A> => {
	const ctx = makeAuthRuntime()
	try {
		return await run(ctx)
	} finally {
		await ctx.runtime.dispose()
	}
}

/** Every `Set-Cookie` as a `cookie` header value (attributes stripped). */
const cookieOf = (headers: Headers): string =>
	headers
		.getSetCookie()
		.map((c) => c.split(';')[0])
		.join('; ')

/**
 * Signs `demo@example.com` up and in through the raw instance (it carries
 * `returnHeaders` without the proxy's type collapse) and returns the
 * session cookie as a `cookie` header value.
 */
const signInCookie = async (ctx: AuthContext): Promise<string> => {
	await runAuth({
		tag: ctx.auth.Tag,
		runtime: ctx.runtime,
		build: (api) =>
			api.signUpEmail({
				body: {
					name: 'Demo',
					email: 'demo@example.com',
					password: 'password123'
				}
			})
	})
	const instance = await ctx.runtime.runPromise(
		Effect.map(ctx.auth.Tag, (authService) => authService.instance)
	)
	const signedIn = await instance.api.signInEmail({
		body: { email: 'demo@example.com', password: 'password123' },
		returnHeaders: true
	})
	return cookieOf(signedIn.headers)
}

describe('runAuth', () => {
	it('resolves the value built from the effectful api', async () => {
		const email = await withRuntime(({ auth, runtime }) =>
			runAuth({
				tag: auth.Tag,
				runtime,
				build: (api) =>
					Effect.gen(function* () {
						const signedUp = yield* api.signUpEmail({
							body: {
								name: 'Demo',
								email: 'demo@example.com',
								password: 'password123'
							}
						})
						return signedUp.user.email
					})
			})
		)
		expect(email).toBe('demo@example.com')
	})

	it('rethrows the failure unwrapped so callers can discriminate on it', async () => {
		const rejection: unknown = await withRuntime(({ auth, runtime }) =>
			runAuth({
				tag: auth.Tag,
				runtime,
				build: (api) =>
					api.signInEmail({
						body: { email: 'nobody@example.com', password: 'wrong-password' }
					})
			}).then(
				() => {
					throw new Error('expected runAuth to reject')
				},
				(error: unknown) => error
			)
		)
		expect(rejection).toBeInstanceOf(BetterAuthApiError)
		if (rejection instanceof BetterAuthApiError) {
			expect(rejection.statusCode).toBe(401)
			expect(rejection.code).toBe('INVALID_EMAIL_OR_PASSWORD')
		}
	})

	it('a missing cookie yields null — no session, no error', async () => {
		const session = await withRuntime(({ auth, runtime }) =>
			runAuth({
				tag: auth.Tag,
				runtime,
				build: (api) => api.getSession({ headers: new Headers() })
			})
		)
		expect(session).toBeNull()
	})

	it('provides headers as ambient CurrentHeaders inside build', async () => {
		const email = await withRuntime(async (ctx) => {
			const cookie = await signInCookie(ctx)
			// `build` never threads headers: the ambient CurrentHeaders that
			// runAuth provides from `headers` carries the session cookie in.
			const session = await runAuth({
				tag: ctx.auth.Tag,
				runtime: ctx.runtime,
				headers: new Headers({ cookie }),
				build: (api) => api.getSession()
			})
			return session?.user.email
		})
		expect(email).toBe('demo@example.com')
	})

	it('rejects with MissingRequestHeaders when required headers are absent', async () => {
		const rejection: unknown = await withRuntime(({ auth, runtime }) =>
			runAuth({
				tag: auth.Tag,
				runtime,
				requireHeaders: true,
				build: (api) => api.getSession()
			}).then(
				() => {
					throw new Error('expected runAuth to reject')
				},
				(error: unknown) => error
			)
		)
		expect(rejection).toBeInstanceOf(MissingRequestHeaders)
	})

	it('explicit per-call headers still win over the ambient ones', async () => {
		const session = await withRuntime(async (ctx) => {
			const cookie = await signInCookie(ctx)
			return runAuth({
				tag: ctx.auth.Tag,
				runtime: ctx.runtime,
				// The ambient jar carries the real session cookie…
				headers: new Headers({ cookie }),
				// …but the call overrides it with an empty one: no session
				// either way. Only explicit-wins semantics yields null here.
				build: (api) => api.getSession({ headers: new Headers() })
			})
		})
		expect(session).toBeNull()
	})
})
