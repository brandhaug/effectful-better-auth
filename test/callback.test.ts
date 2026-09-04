import { Context, Effect, Layer, ManagedRuntime, Schema } from 'effect'
import { describe, expect, it } from 'bun:test'
import { toCallback } from '../src/index.js'

class Boom extends Schema.TaggedError<Boom>('Boom')('Boom', {
	message: Schema.String
}) {}

/** The service shape the callbacks run against. */
type NotifierShape = {
	readonly notify: (message: string) => Effect.Effect<void>
	readonly fail: (message: string) => Effect.Effect<void, Boom>
	readonly die: () => Effect.Effect<void>
}

const Notifier = Context.Service<NotifierShape>('~test/Notifier')

/**
 * `notify` records, `fail` fails typed, `die` defects. The layer closes
 * over the recording array so the promise-land bridge is the only seam
 * under test.
 */
const makeFixture = () => {
	const notified: Array<string> = []
	const layer = Layer.succeed(Notifier)({
		notify: (message) => Effect.sync(() => notified.push(message)),
		fail: (message) => new Boom({ message }),
		die: () => Effect.die('kaput')
	})
	const runtime = ManagedRuntime.make(layer)
	return { notified, runtime }
}

/**
 * A promise that resolves exactly when a drop is reported — the
 * deterministic stand-in for "did the bridge ever call back".
 */
type DropGate = {
	readonly promise: Promise<unknown>
	readonly report: (error: unknown) => void
}

const dropGate = (): DropGate => {
	let report: (error: unknown) => void = () => {}
	const promise = new Promise<unknown>((resolve) => {
		report = resolve
	})
	return { promise, report }
}

describe('toCallback', () => {
	it('awaited resolves the effect value and passes arguments through', async () => {
		const { notified, runtime } = makeFixture()
		try {
			const callbacks = toCallback({ runtime })
			const send = callbacks.awaited((message: string, via: string) =>
				Effect.flatMap(Notifier, (n) => n.notify(`${message} via ${via}`))
			)
			await send('hello', 'callback')
			expect(notified).toEqual(['hello via callback'])
		} finally {
			await runtime.dispose()
		}
	})

	it('awaited rejects with the typed failure so better-auth propagates it', async () => {
		const { runtime } = makeFixture()
		try {
			const callbacks = toCallback({ runtime })
			const send = callbacks.awaited((message: string) =>
				Effect.flatMap(Notifier, (n) => n.fail(message))
			)
			const rejection: unknown = await send('bad').then(
				() => {
					throw new Error('expected the callback to reject')
				},
				(error: unknown) => error
			)
			expect(rejection).toBeInstanceOf(Boom)
		} finally {
			await runtime.dispose()
		}
	})

	it('detached never rejects and reports squashed failures to onDrop', async () => {
		const { runtime } = makeFixture()
		try {
			const gate = dropGate()
			const callbacks = toCallback({ runtime, onDrop: gate.report })
			const fire = callbacks.detached((message: string) =>
				Effect.flatMap(Notifier, (n) => n.fail(message))
			)
			fire('bad')
			expect(await gate.promise).toBeInstanceOf(Boom)
		} finally {
			await runtime.dispose()
		}
	})

	it('detached reports defects too, squashed', async () => {
		const { runtime } = makeFixture()
		try {
			const gate = dropGate()
			const callbacks = toCallback({ runtime, onDrop: gate.report })
			callbacks.detached(() => Effect.flatMap(Notifier, (n) => n.die()))()
			expect(await gate.promise).toBe('kaput')
		} finally {
			await runtime.dispose()
		}
	})

	it('awaited rejects on a construction throw instead of throwing synchronously', async () => {
		const { runtime } = makeFixture()
		try {
			const callbacks = toCallback({ runtime })
			const broken = (): Effect.Effect<void> => {
				throw new Error('construction failed')
			}
			// A synchronous throw here would escape the bridge entirely.
			const rejection: unknown = await callbacks
				.awaited(broken)()
				.then(
					() => {
						throw new Error('expected the callback to reject')
					},
					(error: unknown) => error
				)
			expect(rejection).toBeInstanceOf(Error)
			// oxlint-disable-next-line unicorn/no-instanceof-builtins -- narrowing to read .message; same-realm by construction
			if (rejection instanceof Error) {
				expect(rejection.message).toBe('construction failed')
			}
		} finally {
			await runtime.dispose()
		}
	})

	it('detached reports a construction throw instead of escaping', async () => {
		const { runtime } = makeFixture()
		try {
			const gate = dropGate()
			const callbacks = toCallback({ runtime, onDrop: gate.report })
			const broken = (): Effect.Effect<void> => {
				throw new Error('construction failed')
			}
			expect(() => callbacks.detached(broken)()).not.toThrow()
			const dropped: unknown = await gate.promise
			expect(dropped).toBeInstanceOf(Error)
			// oxlint-disable-next-line unicorn/no-instanceof-builtins -- narrowing to read .message; same-realm by construction
			if (dropped instanceof Error) {
				expect(dropped.message).toBe('construction failed')
			}
		} finally {
			await runtime.dispose()
		}
	})

	it('detached falls back to console.error when no onDrop is given', async () => {
		const { runtime } = makeFixture()
		const original = console.error
		let seen: ReadonlyArray<unknown> = []
		let release: () => void = () => {}
		const reported = new Promise<void>((resolve) => {
			release = resolve
		})
		console.error = (...args: ReadonlyArray<unknown>) => {
			seen = args
			release()
		}
		try {
			const callbacks = toCallback({ runtime })
			callbacks.detached(() => Effect.flatMap(Notifier, (n) => n.fail('bad')))()
			await reported
			expect(seen[0]).toBe('[effectful-better-auth] dropped callback failure')
			expect(seen[1]).toBeInstanceOf(Boom)
		} finally {
			console.error = original
			await runtime.dispose()
		}
	})
})
