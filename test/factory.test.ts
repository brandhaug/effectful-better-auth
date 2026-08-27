import { memoryAdapter } from 'better-auth/adapters/memory'
import { username } from 'better-auth/plugins/username'
import { Cause, Context, Effect, Exit, Layer, Option } from 'effect'
import { describe, expect, it } from 'bun:test'
import { BetterAuthApiError, make, service } from '../src/index.js'

const freshDb = () => ({ user: [], session: [], account: [], verification: [] })

const secret = 'test-secret-at-least-32-characters-long'

describe('make', () => {
	it('returns an Effect of the raw better-auth instance', async () => {
		const instance = await Effect.runPromise(
			make({
				secret,
				baseURL: 'http://localhost:3000',
				emailAndPassword: { enabled: true },
				database: memoryAdapter(freshDb())
			})
		)
		expect(typeof instance.handler).toBe('function')
		expect(typeof instance.api.getSession).toBe('function')
	})
})

describe('service', () => {
	it('provides { api, instance } through the layer', async () => {
		const Auth = service('test/Auth', {
			secret,
			baseURL: 'http://localhost:3000',
			emailAndPassword: { enabled: true },
			database: memoryAdapter(freshDb()),
			plugins: [username()]
		})
		const program = Effect.gen(function* () {
			const auth = yield* Auth.Tag
			const signedUp = yield* auth.api.signUpEmail({
				body: {
					name: 'Demo',
					email: 'demo@example.com',
					password: 'password123',
					username: 'demo'
				}
			})
			return {
				email: signedUp.user.email,
				hasHandler: typeof auth.instance.handler
			}
		})
		const result = await Effect.runPromise(
			program.pipe(Effect.provide(Auth.layer))
		)
		expect(result.email).toBe('demo@example.com')
		expect(result.hasHandler).toBe('function')
	})

	it('fails through the service api with BetterAuthApiError', async () => {
		const Auth = service('test/AuthFail', {
			secret,
			baseURL: 'http://localhost:3000',
			emailAndPassword: { enabled: true },
			database: memoryAdapter(freshDb())
		})
		const program = Effect.gen(function* () {
			const auth = yield* Auth.Tag
			return yield* auth.api.signInEmail({
				body: { email: 'nobody@example.com', password: 'wrong-password' }
			})
		})
		const exit = await Effect.runPromiseExit(
			program.pipe(Effect.provide(Auth.layer))
		)
		expect(Exit.isFailure(exit)).toBe(true)
		if (Exit.isFailure(exit)) {
			const error = Option.getOrThrow(Cause.findErrorOption(exit.cause))
			expect(error).toBeInstanceOf(BetterAuthApiError)
			expect(error.statusCode).toBe(401)
		}
	})

	it('accepts an effectful options builder whose requirements flow into the layer', async () => {
		const AppSecret = Context.Service<{ readonly value: string }>(
			'test/AppSecret'
		)
		const Auth = service(
			'test/AuthBuilt',
			Effect.gen(function* () {
				const appSecret = yield* AppSecret
				return {
					secret: appSecret.value,
					baseURL: 'http://localhost:3000',
					emailAndPassword: { enabled: true },
					database: memoryAdapter(freshDb())
				}
			})
		)
		const deps = Layer.succeed(AppSecret)({ value: secret })
		const program = Effect.gen(function* () {
			const auth = yield* Auth.Tag
			const signedUp = yield* auth.api.signUpEmail({
				body: {
					name: 'Demo',
					email: 'built@example.com',
					password: 'password123'
				}
			})
			return signedUp.user.email
		})
		const result = await Effect.runPromise(
			program.pipe(Effect.provide(Auth.layer.pipe(Layer.provide(deps))))
		)
		expect(result).toBe('built@example.com')
	})

	it('make also accepts an effectful options builder', async () => {
		const instance = await Effect.runPromise(
			make(
				Effect.succeed({
					secret,
					baseURL: 'http://localhost:3000',
					emailAndPassword: { enabled: true },
					database: memoryAdapter(freshDb())
				})
			)
		)
		expect(typeof instance.handler).toBe('function')
	})
})
