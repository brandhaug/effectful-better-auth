# Design Spec: `@brandhaug/better-auth-effect`

Effect v4 integration for [Better Auth](https://better-auth.com). This spec consolidates the decisions from the [wayfinder map](https://github.com/brandhaug/better-auth-effect/issues/1); each section cites the ticket that decided it. Verified targets: `effect@4.0.0-beta.93`, `better-auth@1.6.23`.

## 1. Package identity ([#5](https://github.com/brandhaug/better-auth-effect/issues/5))

- **npm:** `@brandhaug/better-auth-effect` (unscoped `better-auth-effect` and `effect-better-auth` are taken; `@effect/*` and `@better-auth/*` scopes are closed to third parties).
- **Format:** ESM-only. **License:** MIT.
- **Dependencies:** `effect` (v4 range, tracking the beta until stable) and `better-auth` (`^1.x`) as `peerDependencies`. Zero bundled runtime dependencies — no DB drivers, no adapters.

## 2. Module 1 — Service/Layer factory ([#4](https://github.com/brandhaug/better-auth-effect/issues/4), [#6](https://github.com/brandhaug/better-auth-effect/issues/6))

The core problem: `betterAuth(options)` infers its type from the literal options (notably the `plugins` array), so a fixed tag erases plugin-contributed surface. Validated on the [`prototype/typing-strategy`](https://github.com/brandhaug/better-auth-effect/tree/prototype/typing-strategy/prototype-typing) branch:

- **Primitive:** `make<const O extends BetterAuthOptions>(options): Effect<InstanceOf<O>>` — consumers who want full control define their own class tag (`class Auth extends Context.Service<Auth, InstanceOf<typeof options>>()('app/Auth') {}`).
- **Convenience:** `service<const O>(id, options)` returning `{ Tag, layer, call }`, with `Tag = Context.Service<InstanceOf<O>>(id)` (v4 function-style key). One-liner DX; multi-instance via distinct ids (same-id collision is the documented v4 gotcha).
- **Interop:** one erased base tag providing the plugin-independent surface (`handler`, `getSession`) for middleware that must not be generic.
- **Named helper types** (`BetterAuthEffect.Instance<O>`, `BetterAuthEffect.Service<O>`, …) are mandatory exports: TS4023 does not fire on declaration-emit re-export, but inlining costs ~512 KB of `.d.ts` per re-exporting module; named types blunt this.

## 3. Module 2 — Typed call wrapper and errors ([#2](https://github.com/brandhaug/better-auth-effect/issues/2), [#7](https://github.com/brandhaug/better-auth-effect/issues/7))

- `call(f: (api: Instance['api']) => Promise<A>)` runs an `auth.api.*` method with the instance from context.
- **Single tagged error:** `BetterAuthApiError` (`Schema.TaggedErrorClass`) carrying `statusCode: number`, `code: string | undefined` (from `body.code`, matching `$ERROR_CODES`), `message: string`, and `headers`. Discriminate on `statusCode`/`code` — never on `message` (human text, localizable).
- **Defect policy:** `isAPIError(err)` → typed failure; any other throw is a bug or misconfiguration and dies (`Effect.die`). No status-class subclassing on the call path.

## 4. Module 3 — Handler mount ([#3](https://github.com/brandhaug/better-auth-effect/issues/3), [#9](https://github.com/brandhaug/better-auth-effect/issues/9))

- **Primitive:** `toHttpEffect(Tag)` — a plain v4 HTTP effect (`Effect<HttpServerResponse, E, HttpServerRequest | Instance>`): `HttpServerRequest.toWeb` → `auth.handler(webRequest)` → `HttpServerResponse.fromWeb`. Zero `node:*` imports; on Workers `toWeb` returns the original web `Request` unchanged.
- **Convenience:** `route(Tag)` — a Layer registering `HttpRouter.add('*', '<basePath>/*', …)` on the v4 singleton router. `basePath` derives from the better-auth options (`options.basePath ?? '/api/auth'`), overridable at `route()`.
- **No bespoke middleware hooks:** rate limiting, logging, and audit wrap the plain Effect with standard Effect/HttpRouter middleware, consumer-side.
- File-route consumers (e.g. TanStack Start) materialize the primitive with `HttpEffect.toWebHandler`.
- Streaming: bodies pass through `fromWeb` as-is; `HttpEffect.scopeTransferToStream` is the documented escape hatch if ever needed.

## 5. Module 4 — Session middleware ([#10](https://github.com/brandhaug/better-auth-effect/issues/10))

- **Two factory-minted variants, both `$Infer`-typed** (plugin-widened session/user fields flow through):
  - `CurrentSession` — fails typed `Unauthorized` when `getSession` resolves `null` (Better Auth does not throw for missing sessions; the middleware owns this error).
  - `CurrentSessionOption` — provides `Option<Session>` for endpoints serving both audiences.
- Built on v4 `HttpApiMiddleware.Service` (wraps the endpoint response effect), reading the session through the `call` wrapper so failures follow §3.
- **Cookie-cache flags** (`disableCookieCache`, `disableRefresh`) are middleware-constructor options, defaulting off; per-route freshness gets a second instance.
- **Redirects stay app-side.** The middleware is transport-typed only; navigation gates belong to the application.

## 6. Config/options boundary ([#8](https://github.com/brandhaug/better-auth-effect/issues/8))

- **The library defines zero Config keys and reads no environment.** `make`/`service` accept a plain options object or an effectful options builder (`Effect<O, E, R>`); builder requirements flow into the layer's `R` channel. Consumers read their own `Config` with their own key names — Workers-safe by construction.
- Type-bearing options (the `plugins` array above all) stay literal values the compiler can see.
- **No database code:** consumers construct `database: drizzleAdapter(db, …)` (or any adapter) inside the builder from their own services. The package never runs migrations.

## 7. Implementation phasing

1. **Phase 1:** Modules 1 + 2 (factory + call wrapper) — smallest useful surface; dogfood candidate: replacing `requireRequestSession`/`getSession` glue in a consuming app.
2. **Phase 2:** Modules 3 + 4 (mount + middleware).

## 8. Non-goals

- Re-expressing Better Auth's ~33+ endpoints as HttpApi contract routes (the mounted opaque handler is the honest boundary).
- Bundling database drivers or adapters; running migrations.
- Owning env-var naming or reading configuration.
- Client-side (`createAuthClient`) integration — server only, for now.
