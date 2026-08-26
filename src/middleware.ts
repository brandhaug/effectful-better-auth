import { type BetterAuthOptions } from 'better-auth'
import { Context, Effect, Layer, Option, type Schema } from 'effect'
import { HttpServerRequest } from 'effect/unstable/http'
import { HttpApiMiddleware } from 'effect/unstable/httpapi'
import { BetterAuthApiError, Unauthorized } from './errors.js'
import { type Service, type Session, type Tag } from './types.js'

/** Error contract of the required variant: absent session, or transport failure. */
export type CurrentSessionErrors = readonly [
  typeof Unauthorized,
  typeof BetterAuthApiError
]

/** Error contract of the optional variant: transport failures only. */
export type CurrentSessionOptionErrors = typeof BetterAuthApiError

/** The context key handlers yield to read the session under the required variant. */
export type SessionKey<O extends BetterAuthOptions> = Context.Service<
  Session<O>,
  Session<O>
>

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
export type CurrentSessionKey<O extends BetterAuthOptions> =
  HttpApiMiddleware.ServiceClass<
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
  readonly layer: Layer.Layer<
    CurrentSessionId<O> | CurrentSessionOptionId<O>,
    never,
    Service<O>
  >
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
  const CurrentSessionOption = HttpApiMiddleware.Service<
    CurrentSessionOptionId<O>
  >()(`${id}/CurrentSessionOption`, {
    error: BetterAuthApiError
  }) as unknown as CurrentSessionOptionKey<O>

  const readSession = (auth: Service<O>) =>
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      // SAFETY: `EffectApi<Instance<O>['api']>` cannot resolve members while `O` is generic
      // (see the GetSession note above), so the factory reads the endpoint through this
      // shape. The value still goes through the effectful proxy — failures follow SPEC §3.
      // oxlint-disable-next-line effect/noAs, typescript/no-unsafe-type-assertion -- generic O defeats EffectApi member resolution; read through the GetSession shape
      return yield* (auth.api as { getSession: GetSession<O> }).getSession({
        headers: new Headers(request.headers),
        query: {
          disableCookieCache: options?.disableCookieCache ?? false,
          disableRefresh: options?.disableRefresh ?? false
        }
      })
    })

  // Mirror of effect's internal `ErrorSchemaFromConstraint` for the `HttpApiMiddleware`
  // error constraint — the schemas a constraint pins, indexed to their decoded "type",
  // which is what the middleware body must fail with. Only the factory needs it, so it
  // is local. Indexing the resolved conditional (not the bare parameter) mirrors how
  // `HttpApiMiddleware` itself derives `ErrorSchemaFromConstraint<E>["Type"]`.
  type MiddlewareErrorSchema<E extends Schema.Top | readonly Schema.Top[]> =
    E extends readonly Schema.Top[] ? E[number] : E
  type MiddlewareError<E extends Schema.Top | readonly Schema.Top[]> =
    MiddlewareErrorSchema<E>['Type']

  // The shared shape of both variants: read the session through `GetSession`, map
  // null/absent to the variant's provided value (or fail, for the required variant),
  // and hand the continuation the value under the variant's context key. The error
  // constraint's decoded type is what the transform may fail with — enforced here.
  const buildVariant =
    <P, E extends Schema.Top | readonly Schema.Top[]>(params: {
      readonly auth: Service<O>
      readonly serviceTag: Context.Service<P, P>
      readonly transform: (
        session: Session<O> | null
      ) => Effect.Effect<P, MiddlewareError<E>>
    }): HttpApiMiddleware.HttpApiMiddleware<P, E, never> =>
    (httpEffect) =>
      Effect.gen(function* () {
        const session = yield* readSession(params.auth)
        const value = yield* params.transform(session)
        return yield* Effect.provideService(
          httpEffect,
          params.serviceTag,
          value
        )
      })

  const layer = Layer.mergeAll(
    Layer.effect(CurrentSession)(
      Effect.gen(function* () {
        const auth = yield* tag
        return buildVariant<Session<O>, CurrentSessionErrors>({
          auth,
          serviceTag: SessionTag,
          transform: (session) =>
            Option.match(Option.fromNullishOr(session), {
              onNone: () => Effect.fail(new Unauthorized()),
              onSome: (s) => Effect.succeed(s)
            })
        })
      })
    ),
    Layer.effect(CurrentSessionOption)(
      Effect.gen(function* () {
        const auth = yield* tag
        return buildVariant<
          Option.Option<Session<O>>,
          CurrentSessionOptionErrors
        >({
          auth,
          serviceTag: SessionOptionTag,
          transform: (session) => Effect.succeed(Option.fromNullishOr(session))
        })
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
