import { memoryAdapter } from 'better-auth/adapters/memory'
import { Effect, ManagedRuntime } from 'effect'
import { describe, expect, it } from 'bun:test'
import { BetterAuthApiError, runAuth, service } from '../src/index.js'

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

	it('forwards headers into the endpoint calls', async () => {
		await withRuntime(async ({ auth, runtime }) => {
			await runAuth({
				tag: auth.Tag,
				runtime,
				build: (api) =>
					api.signUpEmail({
						body: {
							name: 'Demo',
							email: 'demo@example.com',
							password: 'password123'
						}
					})
			})
			const instance = await runtime.runPromise(
				Effect.map(auth.Tag, (authService) => authService.instance)
			)
			const signedIn = await instance.api.signInEmail({
				body: { email: 'demo@example.com', password: 'password123' },
				returnHeaders: true
			})
			const cookie = signedIn.headers
				.getSetCookie()
				.map((c) => c.split(';')[0])
				.join('; ')
			const session = await runAuth({
				tag: auth.Tag,
				runtime,
				headers: new Headers({ cookie }),
				build: (api, headers) =>
					api.getSession({ headers: headers ?? new Headers() })
			})
			expect(session?.user.email).toBe('demo@example.com')
		})
	})

	it('a missing cookie yields null — no session, no error', async () => {
		const session = await withRuntime(({ auth, runtime }) =>
			runAuth({
				tag: auth.Tag,
				runtime,
				build: (api, headers) =>
					api.getSession({ headers: headers ?? new Headers() })
			})
		)
		expect(session).toBeNull()
	})
})
