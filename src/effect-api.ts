import { isAPIError } from 'better-auth/api'
import { Effect, Option } from 'effect'
import { CurrentHeaders } from './current-headers.js'
import { BetterAuthApiError } from './errors.js'

/**
 * Makes the endpoint context's `headers` property optional so a call may
 * omit it and rely on ambient `CurrentHeaders` injection (or genuinely need
 * none). Every other property — and explicit per-call headers — is unchanged.
 */
type RelaxHeaders<C> = C extends Record<string, unknown>
  ? C extends { headers: infer H }
    ? Omit<C, 'headers'> & { headers?: H | undefined }
    : C
  : C

/**
 * Maps every promise-returning endpoint of `auth.api` to an Effect failing
 * with `BetterAuthApiError` (SPEC §3). Non-function members are dropped.
 *
 * The generic `asResponse`/`returnHeaders` flags collapse to the data
 * branch under this mapped type; the raw instance is the escape hatch for
 * consumers needing the raw `Response` or headers.
 */
export type EffectApi<Api> = {
  // `Promise<unknown>` here is a type-level probe (does the member return a promise?),
  // not a function whose contract is unknown — the actual result type is inferred from
  // the member's own return in the success branch below.
  // oxlint-disable-next-line anti-slop/no-unknown-returns -- Promise<unknown> is a structural probe, not a return contract
  readonly [K in keyof Api as Api[K] extends (...args: never[]) => Promise<unknown>
    ? K
    : never]: Api[K] extends (...args: infer P) => Promise<infer R>
    ? (...args: { readonly [I in keyof P]: RelaxHeaders<P[I]> }) => Effect.Effect<R, BetterAuthApiError>
    : never
}

/**
 * Copies the call's argument list with the ambient `CurrentHeaders` merged
 * into the endpoint options. Explicit per-call headers win; a missing or
 * non-object options bag is replaced by one carrying only the ambient
 * headers.
 */
const injectAmbientHeaders = (
  args: readonly unknown[],
  headers: Headers
): ReadonlyArray<unknown> => {
  const [input] = args
  if (input === undefined || input === null) return [{ headers }, ...args.slice(1)]
  if (typeof input !== 'object') return [...args]
  if ('headers' in input) return [...args]
  return [{ ...input, headers }, ...args.slice(1)]
}

/**
 * Wraps `auth.api` in a runtime `Proxy` so plugin endpoints get effectful
 * support with zero per-plugin code. `isAPIError` throws become typed
 * failures; anything else is a bug or misconfiguration and dies.
 *
 * When `CurrentHeaders` is provided in the effect's context, calls whose
 * options omit `headers` get them injected automatically.
 *
 * The proxy reads every string member through the `api` argument itself, so
 * a non-function member resolves to `undefined` instead of a dead wrapper —
 * the runtime now matches the mapped `EffectApi` type, which drops
 * non-function members.
 */
export const effectApi = <Api extends Record<string, unknown>>(
  api: Api
): EffectApi<Api> => {
  const get = (
    _target: Api,
    prop: PropertyKey
  ): ((...args: unknown[]) => Effect.Effect<unknown, BetterAuthApiError>) | undefined => {
    if (typeof prop !== 'string') return
    const endpoint = api[prop]
    if (typeof endpoint !== 'function') return
    return (...args: unknown[]) =>
      Effect.flatMap(Effect.serviceOption(CurrentHeaders), (ambient) =>
        Effect.tryPromise({
          try: () => {
            const callArgs = Option.match(ambient, {
              onNone: () => args,
              onSome: (headers) => injectAmbientHeaders(args, headers)
            })
            return endpoint(...callArgs)
          },
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
                headers: error.headers
              })
            )
          }
          return Effect.die(error)
        })
      )
  }
  // SAFETY: a runtime Proxy over a third-party object cannot be proven to BE its mapped
  // type — `satisfies` has no answer for a value manufactured at runtime. The proxy is
  // the library's only such boundary, so the cast lives here, once.
  // oxlint-disable-next-line effect/noAs, effect/noKnownValueWidening, typescript/no-unsafe-type-assertion -- the proxy's mapped EffectApi surface is only expressible as a cast
  return new Proxy(api, { get }) as EffectApi<Api>
}
