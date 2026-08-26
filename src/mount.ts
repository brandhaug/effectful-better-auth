import type { BetterAuthOptions } from 'better-auth'
import { Effect, type Layer } from 'effect'
import {
  HttpRouter,
  type HttpServerError,
  HttpServerRequest,
  HttpServerResponse
} from 'effect/unstable/http'
import type { Service, Tag } from './types.js'

/**
 * Primitive mount (SPEC §4): a plain v4 HTTP effect forwarding the incoming
 * request to better-auth's own handler. better-auth resolves errors as
 * `Response`s, so a rejected handler promise is a bug and dies (§3);
 * responses — streaming bodies included — pass through `fromWeb` untouched.
 *
 * File-route consumers materialize this with `HttpEffect.toWebHandler`.
 */
export const toHttpEffect = <O extends BetterAuthOptions>(
  tag: Tag<O>
): Effect.Effect<
  HttpServerResponse.HttpServerResponse,
  HttpServerError.RequestError,
  HttpServerRequest.HttpServerRequest | Service<O>
> =>
  Effect.gen(function* () {
    const auth = yield* tag
    const request = yield* HttpServerRequest.HttpServerRequest
    const webRequest = yield* HttpServerRequest.toWeb(request)
    const response = yield* Effect.promise(() =>
      auth.instance.handler(webRequest)
    )
    return HttpServerResponse.fromWeb(response)
  })

/**
 * Convenience mount (SPEC §4): registers `'*' <basePath>/*` on the v4
 * singleton router. `basePath` derives from the instance's better-auth
 * options (`options.basePath ?? '/api/auth'`); an explicit override here is
 * the single override point. Middleware, rate limiting, and logging are the
 * consumer's composition — no hooks on the mount.
 */
export const route = <O extends BetterAuthOptions>(
  tag: Tag<O>,
  options?: { readonly basePath?: string }
): Layer.Layer<never, never, Service<O> | HttpRouter.HttpRouter> =>
  HttpRouter.use((router) =>
    Effect.gen(function* () {
      const auth = yield* tag
      const basePath =
        options?.basePath ?? auth.instance.options.basePath ?? '/api/auth'
      yield* router.add(
        '*',
        `${basePath}/*` as HttpRouter.PathInput,
        toHttpEffect(tag).pipe(Effect.provideService(tag, auth), Effect.orDie)
      )
    })
  )
