import { type BetterAuthOptions } from 'better-auth'
import { Context, Effect, Layer, Option } from 'effect'
import { HttpServerRequest } from 'effect/unstable/http'
import { HttpApiMiddleware } from 'effect/unstable/httpapi'
import { BetterAuthApiError, Unauthorized } from './errors.js'
import { type Service, type Session, type Tag } from './types.js'

/** Error contract of the required variant: absent session, or transport failure. */
export type CurrentSessionErrors = readonly [typeof Unauthorized, typeof BetterAuthApiError]

/** Error contract of the optional variant: transport failures only. */
export type CurrentSessionOptionErrors = typeof BetterAuthApiError

/** The context key handlers yield to read the session under the required variant. */
export type SessionKey<O extends BetterAuthOptions> = Context.Service<Session<O>, Session<O>>

/** The context key handlers yield under the optional variant. */
export type SessionOptionKey<O extends BetterAuthOptions> = Context.Service<
  Option.Option<Session<O>>,
  Option.Option<Session<O>>
>

/** The middleware function implementing the required variant. */
export type CurrentSessionFn<O extends BetterAuthOptions> =
  HttpApiMiddleware.HttpApiMiddleware<Session<O>, CurrentSessionErrors, never>

/** The middleware function implementing the optional variant. */
export type CurrentSessionOptionFn<O extends BetterAuthOptions> =
  HttpApiMiddleware.HttpApiMiddleware<
    Option.Option<Session<O>>,
    CurrentSessionOptionErrors,
    never
  >

/**
 * The identifier of the required middleware service. The literal
 * `'~effect/httpapi/HttpApiMiddleware'` property mirrors the metadata the
 * class-declared form would carry; it is what lets `HttpApi` contracts
 * accept a factory-minted key in `.middleware(...)`.
 */
export type CurrentSessionId<O extends BetterAuthOptions> =
  Context.ServiceClass.Shape<string, CurrentSessionFn<O>> & {
    readonly '~effect/httpapi/HttpApiMiddleware': {
      readonly provides: Session<O>
      readonly requires: never
      readonly error: CurrentSessionErrors
      readonly clientError: never
      readonly requiredForClient: false
    }
  }

/** The identifier of the optional middleware service. */
export type CurrentSessionOptionId<O extends BetterAuthOptions> =
  Context.ServiceClass.Shape<string, CurrentSessionOptionFn<O>> & {
    readonly '~effect/httpapi/HttpApiMiddleware': {
      readonly provides: Option.Option<Session<O>>
      readonly requires: never
      readonly error: CurrentSessionOptionErrors
      readonly clientError: never
      readonly requiredForClient: false
    }
  }

/** The middleware key of the required variant, as declared on `HttpApi` contracts. */
export type CurrentSessionKey<O extends BetterAuthOptions> = HttpApiMiddleware.ServiceClass<
  CurrentSessionId<O>,
  string,
  {
    requires: never
    provides: Session<O>
    error: CurrentSessionErrors
    clientError: never
    requiredForClient: false
    security: never
  }
>

/** The middleware key of the optional variant. */
export type CurrentSessionOptionKey<O extends BetterAuthOptions> =
  HttpApiMiddleware.ServiceClass<
    CurrentSessionOptionId<O>,
    string,
    {
      requires: never
      provides: Option.Option<Session<O>>
      error: CurrentSessionOptionErrors
      clientError: never
      requiredForClient: false
      security: never
    }
  >

/** Cookie-cache flags forwarded to `getSession`'s query (SPEC §5), defaulting off. */
export type SessionMiddlewareOptions = {
  readonly disableCookieCache?: boolean
  readonly disableRefresh?: boolean
}

/** What `sessionMiddleware(id, Tag, options?)` returns. */
export type SessionMiddleware<O extends BetterAuthOptions> = {
  readonly CurrentSession: CurrentSessionKey<O>
  readonly CurrentSessionOption: CurrentSessionOptionKey<O>
  readonly Session: SessionKey<O>
  readonly SessionOption: SessionOptionKey<O>
  readonly layer: Layer.Layer<CurrentSessionId<O> | CurrentSessionOptionId<O>, never, Service<O>>
}

/**
 * `EffectApi<Instance<O>['api']>` cannot resolve members while `O` is
 * generic, so the factory reads `getSession` through this shape. The value
 * still goes through the effectful proxy — failures follow SPEC §3.
 */
type GetSession<O extends BetterAuthOptions> = (input: {
  readonly headers: Headers
  readonly query: {
    readonly disableCookieCache: boolean
    readonly disableRefresh: boolean
  }
}) => Effect.Effect<Session<O> | null, BetterAuthApiError>

/**
 * Middleware factory (SPEC §5): mints both `$Infer`-typed variants from a
 * `Tag<O>`. Per-route freshness gets a second instance under a distinct id.
 * Redirects stay app-side — the middleware is transport-typed only.
 */
export const sessionMiddleware = <O extends BetterAuthOptions>(
  id: string,
  tag: Tag<O>,
  options?: SessionMiddlewareOptions
): SessionMiddleware<O> => {
  const SessionTag: SessionKey<O> = Context.Service<Session<O>>(`${id}/Session`)
  const SessionOptionTag: SessionOptionKey<O> = Context.Service<
    Option.Option<Session<O>>
  >(`${id}/SessionOption`)
  // SAFETY: `HttpApiMiddleware.Service` infers `provides: never` from the middleware
  // function shape, not from the `~effect/httpapi/HttpApiMiddleware` metadata that
  // carries the real `provides`/`error` contract. The declared keys below are that
  // metadata made explicit for `HttpApi` contracts; bridging the two is the factory's
  // boundary.
  // oxlint-disable-next-line effect/noAs, effect/noChainedTypeAssertions, typescript/no-unsafe-type-assertion -- HttpApiMiddleware.Service cannot see the declared middleware metadata
  const CurrentSession = HttpApiMiddleware.Service<CurrentSessionId<O>>()(
    `${id}/CurrentSession`,
    { error: [Unauthorized, BetterAuthApiError] }
  ) as unknown as CurrentSessionKey<O>
  // SAFETY: same bridge as the required variant — `HttpApiMiddleware.Service` cannot
  // see the declared metadata, so the optional key re-states it.
  // oxlint-disable-next-line effect/noAs, effect/noChainedTypeAssertions, typescript/no-unsafe-type-assertion -- HttpApiMiddleware.Service cannot see the declared middleware metadata
  const CurrentSessionOption = HttpApiMiddleware.Service<CurrentSessionOptionId<O>>()(
    `${id}/CurrentSessionOption`,
    { error: BetterAuthApiError }
  ) as unknown as CurrentSessionOptionKey<O>

  const query = {
    disableCookieCache: options?.disableCookieCache ?? false,
    disableRefresh: options?.disableRefresh ?? false
  }

  const readSession = (auth: Service<O>) =>
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      // SAFETY: `EffectApi<Instance<O>['api']>` cannot resolve members while `O` is generic
      // (see the GetSession note above), so the factory reads the endpoint through this
      // shape. The value still goes through the effectful proxy — failures follow SPEC §3.
      // oxlint-disable-next-line effect/noAs, typescript/no-unsafe-type-assertion -- generic O defeats EffectApi member resolution; read through the GetSession shape
      return yield* (auth.api as { getSession: GetSession<O> }).getSession({
        headers: new Headers(request.headers),
        query
      })
    })

  const layer = Layer.mergeAll(
    Layer.effect(CurrentSession)(
      Effect.gen(function* () {
        const auth = yield* tag
        const middleware: CurrentSessionFn<O> = (httpEffect) =>
          Effect.gen(function* () {
            const session = yield* readSession(auth)
            if (session === null) return yield* Effect.fail(new Unauthorized())
            return yield* Effect.provideService(httpEffect, SessionTag, session)
          })
        return middleware
      })
    ),
    Layer.effect(CurrentSessionOption)(
      Effect.gen(function* () {
        const auth = yield* tag
        const middleware: CurrentSessionOptionFn<O> = (httpEffect) =>
          Effect.gen(function* () {
            const session = yield* readSession(auth)
            return yield* Effect.provideService(
              httpEffect,
              SessionOptionTag,
              Option.fromNullishOr(session)
            )
          })
        return middleware
      })
    )
  )

  return {
    CurrentSession,
    CurrentSessionOption,
    Session: SessionTag,
    SessionOption: SessionOptionTag,
    layer
  }
}
