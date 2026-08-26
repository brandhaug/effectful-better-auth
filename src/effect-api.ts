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
  if ((input as { headers?: unknown }).headers !== undefined) return [...args]
  return [{ ...input, headers }, ...args.slice(1)]
}

/**
 * Wraps `auth.api` in a runtime `Proxy` so plugin endpoints get effectful
 * support with zero per-plugin code. `isAPIError` throws become typed
 * failures; anything else is a bug or misconfiguration and dies.
 *
 * When `CurrentHeaders` is provided in the effect's context, calls whose
 * options omit `headers` get them injected automatically.
 */
export const effectApi = <Api extends Record<string, unknown>>(
  api: Api
): EffectApi<Api> =>
  new Proxy({} as Record<string, unknown>, {
    get: (_target, prop) => {
      if (typeof prop !== 'string') return undefined
      return (...args: unknown[]) =>
        Effect.flatMap(Effect.serviceOption(CurrentHeaders), (ambient) =>
          Effect.tryPromise({
            try: () =>
              (api[prop] as (...a: unknown[]) => Promise<unknown>)(
                ...(Option.isSome(ambient) ? injectAmbientHeaders(args, ambient.value) : args)
              ),
            catch: (cause) => cause
          })
        ).pipe(
          Effect.catch((cause: unknown) =>
            isAPIError(cause)
              ? Effect.fail(
                  new BetterAuthApiError({
                    statusCode: cause.statusCode,
                    code: cause.body?.code,
                    message: cause.message,
                    headers: cause.headers
                  })
                )
              : Effect.die(cause)
          )
        )
    }
  }) as EffectApi<Api>
