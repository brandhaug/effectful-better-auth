import { memoryAdapter } from 'better-auth/adapters/memory'
import { Effect, Layer } from 'effect'
import { HttpEffect, HttpRouter } from 'effect/unstable/http'
import { describe, expect, it } from 'bun:test'
import {
	effectApi,
	fullApi,
	handleWebRequest,
	make,
	route,
	service,
	toHttpEffect
} from '../src/index.js'

const freshDb = () => ({ user: [], session: [], account: [], verification: [] })

const secret = 'test-secret-at-least-32-characters-long'

const baseOptions = () => ({
	secret,
	baseURL: 'http://localhost:3000',
	emailAndPassword: { enabled: true },
	database: memoryAdapter(freshDb())
})

const signUpRequest = (email: string, basePath = '/api/auth') =>
	new Request(`http://localhost:3000${basePath}/sign-up/email`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ name: 'Demo', email, password: 'password123' })
	})

describe('toHttpEffect', () => {
	it('drives sign-up → sign-in → get-session with real requests', async () => {
		const Auth = service('mount/Auth', baseOptions())
		const handler = HttpEffect.toWebHandler(
			toHttpEffect(Auth.Tag).pipe(Effect.provide(Auth.layer))
		)

		const signUp = await handler(signUpRequest('mount@example.com'))
		expect(signUp.status).toBe(200)
		expect(signUp.headers.get('set-cookie')).toMatch(
			/better-auth\.session_token=/
		)

		const signIn = await handler(
			new Request('http://localhost:3000/api/auth/sign-in/email', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					email: 'mount@example.com',
					password: 'password123'
				})
			})
		)
		expect(signIn.status).toBe(200)
		const cookie = signIn.headers.get('set-cookie')
		expect(cookie).toMatch(/better-auth\.session_token=/)

		const session = await handler(
			new Request('http://localhost:3000/api/auth/get-session', {
				headers: { cookie: cookie ?? '' }
			})
		)
		expect(session.status).toBe(200)
		const body: { user: { email: string } } = await session.json()
		expect(body.user.email).toBe('mount@example.com')
	})

	it("passes unknown paths under the basePath through to better-auth's own 404", async () => {
		const Auth = service('mount/Auth404', baseOptions())
		const handler = HttpEffect.toWebHandler(
			toHttpEffect(Auth.Tag).pipe(Effect.provide(Auth.layer))
		)
		const response = await handler(
			new Request('http://localhost:3000/api/auth/no-such-endpoint')
		)
		expect(response.status).toBe(404)
	})
})

/**
 * A service layer whose instance.handler records the pathnames it is asked
 * to serve — the observable seam for where `route` mounts.
 */
const spiedService = async (
	id: string,
	options: Parameters<typeof make>[0]
) => {
	const Auth = service(id, options)
	const instance = await Effect.runPromise(make(options))
	const seen: Array<string> = []
	const spied = {
		...instance,
		handler: (request: Request) => {
			seen.push(new URL(request.url).pathname)
			return instance.handler(request)
		}
	}
	const layer = Layer.succeed(Auth.Tag)({
		api: effectApi(spied.api),
		full: fullApi(spied.api),
		instance: spied
	})
	return { Tag: Auth.Tag, layer, seen }
}

describe('handleWebRequest', () => {
	it('answers a plain web Request with a plain web Response', async () => {
		const Auth = service('mount/WebRequest', baseOptions())
		const signUp = await Effect.runPromise(
			handleWebRequest(Auth.Tag, signUpRequest('web@example.com')).pipe(
				Effect.provide(Auth.layer)
			)
		)
		expect(signUp.status).toBe(200)
		expect(signUp.headers.get('set-cookie')).toMatch(
			/better-auth\.session_token=/
		)
		const body: { user: { email: string } } = await signUp.json()
		expect(body.user.email).toBe('web@example.com')
	})

	it('carries request cookies through to the session endpoint', async () => {
		const Auth = service('mount/WebRequestSession', baseOptions())
		const signUp = await Effect.runPromise(
			handleWebRequest(Auth.Tag, signUpRequest('web2@example.com')).pipe(
				Effect.provide(Auth.layer)
			)
		)
		const cookie = signUp.headers
			.getSetCookie()
			.map((c) => c.split(';')[0])
			.join('; ')
		const session = await Effect.runPromise(
			handleWebRequest(
				Auth.Tag,
				new Request('http://localhost:3000/api/auth/get-session', {
					headers: { cookie }
				})
			).pipe(Effect.provide(Auth.layer))
		)
		expect(session.status).toBe(200)
		const body: { user: { email: string } } = await session.json()
		expect(body.user.email).toBe('web2@example.com')
	})
})

describe('route', () => {
	it('mounts at /api/auth when the instance options set no basePath', async () => {
		const Auth = service('mount/AuthRoute', baseOptions())
		const { handler, dispose } = HttpRouter.toWebHandler(
			route(Auth.Tag).pipe(Layer.provide(Auth.layer))
		)
		try {
			const signUp = await handler(signUpRequest('route@example.com'))
			expect(signUp.status).toBe(200)
			expect(signUp.headers.get('set-cookie')).toMatch(
				/better-auth\.session_token=/
			)
		} finally {
			await dispose()
		}
	})

	it('derives the mount from an instance-configured basePath', async () => {
		const Auth = service('mount/AuthRouteInstancePath', {
			...baseOptions(),
			basePath: '/custom/auth'
		})
		const { handler, dispose } = HttpRouter.toWebHandler(
			route(Auth.Tag).pipe(Layer.provide(Auth.layer))
		)
		try {
			const signUp = await handler(
				signUpRequest('custom@example.com', '/custom/auth')
			)
			expect(signUp.status).toBe(200)
			const offPath = await handler(signUpRequest('off@example.com'))
			expect(offPath.status).toBe(404)
		} finally {
			await dispose()
		}
	})

	it('an explicit basePath on route() overrides the instance options', async () => {
		const auth = await spiedService('mount/AuthRouteOverride', {
			...baseOptions(),
			basePath: '/custom/auth'
		})
		const { handler, dispose } = HttpRouter.toWebHandler(
			route(auth.Tag, { basePath: '/elsewhere' }).pipe(
				Layer.provide(auth.layer)
			)
		)
		try {
			await handler(new Request('http://localhost:3000/elsewhere/get-session'))
			expect(auth.seen).toEqual(['/elsewhere/get-session'])
			const offMount = await handler(
				new Request('http://localhost:3000/custom/auth/get-session')
			)
			expect(offMount.status).toBe(404)
			expect(auth.seen).toEqual(['/elsewhere/get-session'])
		} finally {
			await dispose()
		}
	})
})
