import { Cause, Effect, Exit, type ManagedRuntime } from 'effect'

/**
 * The default drop report for detached callbacks: a callback better-auth
 * fired without awaiting must never vanish silently, so without a custom
 * `onDrop` the squashed failure lands on the console — the promise-land
 * equivalent of a defect log, and the last line of defense.
 */
const reportDrop = (
	onDrop: ((error: unknown) => void) | undefined,
	error: unknown
): void => {
	if (onDrop !== undefined) {
		onDrop(error)
		return
	}
	// oxlint-disable-next-line effect/noGlobals -- deliberate promise-land default report: a detached callback boundary has no ambient Effect to log through
	console.error('[effectful-better-auth] dropped callback failure', error)
}

/** The two bridges `toCallback` hands back. */
export type CallbackBridge<R> = {
	/**
	 * For callbacks better-auth awaits (email senders, `databaseHooks`):
	 * the returned function resolves with the effect's value and rejects
	 * with its failure, so better-auth propagates the error.
	 */
	readonly awaited: <Args extends Array<unknown>, A, E>(
		build: (...args: Args) => Effect.Effect<A, E, R>
	) => (...args: Args) => Promise<A>
	/**
	 * For callbacks better-auth fires without awaiting (background tasks):
	 * the returned function never rejects; failures and defects — including
	 * construction throws and the runtime's own layer failures — are
	 * squashed and reported to `onDrop` (default: `console.error`).
	 */
	readonly detached: <Args extends Array<unknown>, A, E>(
		build: (...args: Args) => Effect.Effect<A, E, R>
	) => (...args: Args) => void
}

/**
 * Bridges Effects into better-auth's plain-function callbacks: email
 * senders, `databaseHooks`, and `advanced.backgroundTasks.handler` are all
 * invoked by better-auth outside any Effect context — there is no ambient
 * runtime, no Clock, no telemetry. `toCallback` hands those seams a runtime.
 *
 * The runtime is whatever the callbacks need (e.g. the app's email
 * services); it must not be the auth instance's own runtime when the
 * callbacks participate in building that instance — that circle does not
 * close.
 */
export const toCallback = <R>(options: {
	readonly runtime: ManagedRuntime.ManagedRuntime<R, unknown>
	readonly onDrop?: ((error: unknown) => void) | undefined
}): CallbackBridge<R> => ({
	// `Effect.suspend` captures construction throws into the effect, so a
	// `build` that throws while building lands in the rejection (or the drop
	// report) instead of escaping synchronously into better-auth.
	awaited:
		(build) =>
		(...args) =>
			options.runtime.runPromise(Effect.suspend(() => build(...args))),
	// Fork, never await: a fired-and-forgotten callback reports its exit
	// through the observer instead of a promise nobody holds.
	detached:
		(build) =>
		(...args) => {
			const fiber = options.runtime.runFork(
				Effect.suspend(() => build(...args))
			)
			fiber.addObserver((exit) => {
				if (Exit.isFailure(exit)) {
					reportDrop(options.onDrop, Cause.squash(exit.cause))
				}
			})
		}
})
