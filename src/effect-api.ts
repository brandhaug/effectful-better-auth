import { isAPIError } from 'better-auth/api'
import { Effect } from 'effect'
import { BetterAuthApiError } from './errors.js'

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
    ? (...args: P) => Effect.Effect<R, BetterAuthApiError>
    : never
}

/**
 * Wraps `auth.api` in a runtime `Proxy` so plugin endpoints get effectful
 * support with zero per-plugin code. `isAPIError` throws become typed
 * failures; anything else is a bug or misconfiguration and dies.
 */
export const effectApi = <Api extends Record<string, unknown>>(
  api: Api
): EffectApi<Api> =>
  new Proxy({} as Record<string, unknown>, {
    get: (_target, prop) => {
      if (typeof prop !== 'string') return undefined
      return (...args: unknown[]) =>
        Effect.tryPromise({
          try: () => (api[prop] as (...a: unknown[]) => Promise<unknown>)(...args),
          catch: (cause) => cause
        }).pipe(
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
