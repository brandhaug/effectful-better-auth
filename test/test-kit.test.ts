import { memoryAdapter } from 'better-auth/adapters/memory'
import { Effect } from 'effect'
import { describe, expect, it } from 'bun:test'
import {
	cookieHeader,
	cookiePairs,
	mergeCookiePairs,
	service,
	signUpSession
} from '../src/index.js'

const freshDb = () => ({ user: [], session: [], account: [], verification: [] })

/** Fresh service + isolated memory DB per test (see run-auth.test.ts). */
const makeAuth = () =>
	service('kit/Auth', {
		secret: 'test-secret-at-least-32-characters-long',
		baseURL: 'http://localhost:3000',
		emailAndPassword: { enabled: true },
		database: memoryAdapter(freshDb())
	})

describe('cookie helpers', () => {
	it('cookiePairs strips attributes and keeps every set cookie', () => {
		const headers = new Headers()
		headers.append('set-cookie', 'a=1; Path=/; HttpOnly')
		headers.append('set-cookie', 'b=2; Secure')
		expect(cookiePairs(headers)).toEqual(['a=1', 'b=2'])
	})

	it('cookieHeader joins pairs into a request header value', () => {
		expect(cookieHeader(['a=1', 'b=2'])).toBe('a=1; b=2')
	})

	it('mergeCookiePairs keeps the latest write per cookie name', () => {
		const merged = mergeCookiePairs(
			['better-auth.session_token=old', 'x-state=1'],
			['better-auth.session_token=new']
		)
		expect(merged).toEqual(['better-auth.session_token=new', 'x-state=1'])
	})
})

describe('signUpSession', () => {
	it('captures a cookie jar the api accepts as a signed-in session', async () => {
		const auth = makeAuth()
		const signUp = await Effect.runPromise(
			signUpSession(auth.Tag, {
				email: 'kit@example.com',
				password: 'password123'
			}).pipe(Effect.provide(auth.layer))
		)
		expect(signUp.cookiePairs.length).toBeGreaterThan(0)
		expect(signUp.cookieHeader).toContain('better-auth.session_token=')

		const session = await Effect.runPromise(
			Effect.flatMap(auth.Tag, ({ api }) =>
				api.getSession({ headers: signUp.headers })
			).pipe(Effect.provide(auth.layer))
		)
		expect(session?.user.id).toBe(signUp.userId)
		expect(session?.user.email).toBe('kit@example.com')
	})

	it('merges a later rotation over the sign-up cookie', async () => {
		const auth = makeAuth()
		const signUp = await Effect.runPromise(
			signUpSession(auth.Tag, {
				email: 'rotate@example.com',
				password: 'password123'
			}).pipe(Effect.provide(auth.layer))
		)
		const rotation = await Effect.runPromise(
			Effect.flatMap(auth.Tag, ({ full }) =>
				full.signOut({ headers: signUp.headers })
			).pipe(Effect.provide(auth.layer))
		)
		const merged = mergeCookiePairs(
			signUp.cookiePairs,
			cookiePairs(rotation.headers)
		)
		const session = await Effect.runPromise(
			Effect.flatMap(auth.Tag, ({ api }) =>
				api.getSession({
					headers: new Headers({ cookie: cookieHeader(merged) })
				})
			).pipe(Effect.provide(auth.layer))
		)
		// The rotated (emptied) token replaces the sign-up token: no session.
		expect(session).toBeNull()
	})
})
