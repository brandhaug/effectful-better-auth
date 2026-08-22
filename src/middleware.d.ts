import type { BetterAuthOptions } from 'better-auth';
import { Context, Layer, Option } from 'effect';
import { HttpApiMiddleware } from 'effect/unstable/httpapi';
import { BetterAuthApiError, Unauthorized } from './errors.js';
import type { Service, Session, Tag } from './types.js';
/** Error contract of the required variant: absent session, or transport failure. */
export type CurrentSessionErrors = readonly [typeof Unauthorized, typeof BetterAuthApiError];
/** Error contract of the optional variant: transport failures only. */
export type CurrentSessionOptionErrors = typeof BetterAuthApiError;
/** The context key handlers yield to read the session under the required variant. */
export type SessionKey<O extends BetterAuthOptions> = Context.Service<Session<O>, Session<O>>;
/** The context key handlers yield under the optional variant. */
export type SessionOptionKey<O extends BetterAuthOptions> = Context.Service<Option.Option<Session<O>>, Option.Option<Session<O>>>;
/** The middleware function implementing the required variant. */
export type CurrentSessionFn<O extends BetterAuthOptions> = HttpApiMiddleware.HttpApiMiddleware<Session<O>, CurrentSessionErrors, never>;
/** The middleware function implementing the optional variant. */
export type CurrentSessionOptionFn<O extends BetterAuthOptions> = HttpApiMiddleware.HttpApiMiddleware<Option.Option<Session<O>>, CurrentSessionOptionErrors, never>;
/**
 * The identifier of the required middleware service. The literal
 * `'~effect/httpapi/HttpApiMiddleware'` property mirrors the metadata the
 * class-declared form would carry; it is what lets `HttpApi` contracts
 * accept a factory-minted key in `.middleware(...)`.
 */
export interface CurrentSessionId<O extends BetterAuthOptions> extends Context.ServiceClass.Shape<string, CurrentSessionFn<O>> {
    readonly '~effect/httpapi/HttpApiMiddleware': {
        readonly provides: Session<O>;
        readonly requires: never;
        readonly error: CurrentSessionErrors;
        readonly clientError: never;
        readonly requiredForClient: false;
    };
}
/** The identifier of the optional middleware service. */
export interface CurrentSessionOptionId<O extends BetterAuthOptions> extends Context.ServiceClass.Shape<string, CurrentSessionOptionFn<O>> {
    readonly '~effect/httpapi/HttpApiMiddleware': {
        readonly provides: Option.Option<Session<O>>;
        readonly requires: never;
        readonly error: CurrentSessionOptionErrors;
        readonly clientError: never;
        readonly requiredForClient: false;
    };
}
/** The middleware key of the required variant, as declared on `HttpApi` contracts. */
export type CurrentSessionKey<O extends BetterAuthOptions> = HttpApiMiddleware.ServiceClass<CurrentSessionId<O>, string, {
    requires: never;
    provides: Session<O>;
    error: CurrentSessionErrors;
    clientError: never;
    requiredForClient: false;
    security: never;
}>;
/** The middleware key of the optional variant. */
export type CurrentSessionOptionKey<O extends BetterAuthOptions> = HttpApiMiddleware.ServiceClass<CurrentSessionOptionId<O>, string, {
    requires: never;
    provides: Option.Option<Session<O>>;
    error: CurrentSessionOptionErrors;
    clientError: never;
    requiredForClient: false;
    security: never;
}>;
/** Cookie-cache flags forwarded to `getSession`'s query (SPEC §5), defaulting off. */
export interface SessionMiddlewareOptions {
    readonly disableCookieCache?: boolean;
    readonly disableRefresh?: boolean;
}
/** What `sessionMiddleware(id, Tag, options?)` returns. */
export interface SessionMiddleware<O extends BetterAuthOptions> {
    readonly CurrentSession: CurrentSessionKey<O>;
    readonly CurrentSessionOption: CurrentSessionOptionKey<O>;
    readonly Session: SessionKey<O>;
    readonly SessionOption: SessionOptionKey<O>;
    readonly layer: Layer.Layer<CurrentSessionId<O> | CurrentSessionOptionId<O>, never, Service<O>>;
}
/**
 * Middleware factory (SPEC §5): mints both `$Infer`-typed variants from a
 * `Tag<O>`. Per-route freshness gets a second instance under a distinct id.
 * Redirects stay app-side — the middleware is transport-typed only.
 */
export declare const sessionMiddleware: <O extends BetterAuthOptions>(id: string, tag: Tag<O>, options?: SessionMiddlewareOptions) => SessionMiddleware<O>;
