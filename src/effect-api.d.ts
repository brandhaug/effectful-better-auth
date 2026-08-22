import { Effect } from 'effect';
import { BetterAuthApiError } from './errors.js';
/**
 * Maps every promise-returning endpoint of `auth.api` to an Effect failing
 * with `BetterAuthApiError` (SPEC §3). Non-function members are dropped.
 *
 * The generic `asResponse`/`returnHeaders` flags collapse to the data
 * branch under this mapped type; the raw instance is the escape hatch for
 * consumers needing the raw `Response` or headers.
 */
export type EffectApi<Api> = {
    readonly [K in keyof Api as Api[K] extends (...args: never[]) => Promise<unknown> ? K : never]: Api[K] extends (...args: infer P) => Promise<infer R> ? (...args: P) => Effect.Effect<R, BetterAuthApiError> : never;
};
/**
 * Wraps `auth.api` in a runtime `Proxy` so plugin endpoints get effectful
 * support with zero per-plugin code. `isAPIError` throws become typed
 * failures; anything else is a bug or misconfiguration and dies.
 */
export declare const effectApi: <Api extends Record<string, unknown>>(api: Api) => EffectApi<Api>;
