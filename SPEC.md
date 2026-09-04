# Design Spec: `effectful-better-auth`

Effect v4 integration for [Better Auth](https://better-auth.com). This spec consolidates the decisions from the [wayfinder map](https://github.com/brandhaug/effectful-better-auth/issues/1); each section cites the ticket that decided it. Verified targets: `effect@4.0.0-beta.93`, `better-auth@1.6.23`.

## 1. Package identity ([#5](https://github.com/brandhaug/effectful-better-auth/issues/5))

- **npm:** `effectful-better-auth`, unscoped (availability verified 2026-07-28). `better-auth-effect` and `effect-better-auth` are taken by unrelated/dead packages; `@effect/*` and `@better-auth/*` scopes are closed to third parties. Originally decided as `@brandhaug/better-auth-effect` ([#5](https://github.com/brandhaug/effectful-better-auth/issues/5)); renamed by amendment for discoverability ([#12](https://github.com/brandhaug/effectful-better-auth/issues/12)). GitHub repo renamed to match.
- **Format:** ESM-only. **License:** MIT.
- **Dependencies:** `effect` (v4 range, tracking the beta until stable) and `better-auth` (`^1.x`) as `peerDependencies`. Zero bundled runtime dependencies — no DB drivers, no adapters.

## 2. Module 1 — Service/Layer factory ([#4](https://github.com/brandhaug/effectful-better-auth/issues/4), [#6](https://github.com/brandhaug/effectful-better-auth/issues/6))

The core problem: `betterAuth(options)` infers its type from the literal options (notably the `plugins` array), so a fixed tag erases plugin-contributed surface. Validated on the [`prototype/typing-strategy`](https://github.com/brandhaug/effectful-better-auth/tree/prototype/typing-strategy/prototype-typing) branch:

- **Primitive:** `make<const O extends BetterAuthOptions>(options): Effect<InstanceOf<O>>` — consumers who want full control define their own class tag and wrap with the exported `effectApi(instance.api)` helper (§3).
- **Convenience (the headline API — docs lead with this):** `service<const O>(id, options)` returning `{ Tag, layer }`, with `Tag = Context.Service<ServiceShape<O>>(id)` (v4 function-style key). The provided service shape is `{ api: EffectApi<InstanceOf<O>['api']>, instance: InstanceOf<O> }` (§3). Multi-instance via distinct ids (same-id collision is the documented v4 gotcha).
- **Named helper types** (`BetterAuthEffect.Instance<O>`, `BetterAuthEffect.Service<O>`, …) are mandatory exports: TS4023 does not fire on declaration-emit re-export, but inlining costs ~0.5 MB of `.d.ts` per re-exporting module; named types blunt this.
- The erased base interop tag from the original design was **cut by amendment [#12](https://github.com/brandhaug/effectful-better-auth/issues/12)**: it became vestigial once the middleware was made factory-minted (§5). Reintroduce in a minor version only when a concrete need appears.

## 3. Module 2 — Effectful API and errors ([#2](https://github.com/brandhaug/effectful-better-auth/issues/2), [#7](https://github.com/brandhaug/effectful-better-auth/issues/7), amended by [#12](https://github.com/brandhaug/effectful-better-auth/issues/12))

- **Effectful `api` proxy (replaces the earlier `call` combinator):** every `auth.api.*` endpoint is an Effect directly — `yield* auth.api.listUsers({ query: { limit: 10 } })` fails with `BetterAuthApiError`. Implemented as a runtime `Proxy` plus a mapped type (`EffectApi<Api>`) over the plugin-inferred endpoint record, so plugins get typed support with zero per-plugin code. Validated on the prototype branch (`src/proxy.ts`).
- **`full` twin (2026-09-04):** the service also exposes `auth.full` (`fullApi(instance.api)`, mapped type `FullApi<Api>`) — the same proxy with `returnHeaders: true` injected at runtime, so each call resolves with `{ headers, response }`. Motivated by dogfooding: every cookie-carrying flow (sign-up sessions, TOTP rotations, SSO state, passkey challenges) previously bypassed the proxy for `instance.api.*({ returnHeaders: true })` inside `Effect.promise`. Ambient `CurrentHeaders` and the error policy are shared with `api`; the mapped param type admits only `returnHeaders: true` or omission.
- **Escape hatch:** the raw instance at `service.instance`. The mapped types collapse the generic `asResponse` flag to the data branch (verified by probe); consumers needing the raw `Response` or the full handler call `instance.api.*` / `instance.handler` directly. One idiom, one full twin, one trapdoor — no fourth invocation style.
- **Single tagged error:** `BetterAuthApiError` (`Schema.TaggedError`) carrying `statusCode: number`, `code: string | undefined` (from `body.code`, matching `$ERROR_CODES`), `message: string`, and `headers`. Discriminate on `statusCode`/`code` — never on `message` (human text, localizable).
- **Defect policy:** `isAPIError(err)` → typed failure; any other throw is a bug or misconfiguration and dies (`Effect.die`, via v4 `Effect.catch`). No status-class subclassing.

## 4. Module 3 — Handler mount ([#3](https://github.com/brandhaug/effectful-better-auth/issues/3), [#9](https://github.com/brandhaug/effectful-better-auth/issues/9))

- **Primitive:** `toHttpEffect(Tag)` — a plain v4 HTTP effect (`Effect<HttpServerResponse, E, HttpServerRequest | Instance>`): `HttpServerRequest.toWeb` → `auth.handler(webRequest)` → `HttpServerResponse.fromWeb`. Zero `node:*` imports; on Workers `toWeb` returns the original web `Request` unchanged.
- **Web-standard helper (2026-09-04):** `handleWebRequest(Tag, request)` — `fromWeb` → `toHttpEffect` → `toWeb` collapsed into `Effect<Response, RequestError, Service>`, for file-route handlers that hold a plain `Request` (TanStack Start) and well-known paths (RFC 8414 discovery) mounted outside the catchall. Dogfooding showed both call sites repeating that plumbing verbatim.
- **Convenience:** `route(Tag)` — a Layer registering `HttpRouter.add('*', '<basePath>/*', …)` on the v4 singleton router. `basePath` derives from the better-auth options (`options.basePath ?? '/api/auth'`), overridable at `route()`.
- **No bespoke middleware hooks:** rate limiting, logging, and audit wrap the plain Effect with standard Effect/HttpRouter middleware, consumer-side.
- File-route consumers (e.g. TanStack Start) materialize the primitive with `HttpEffect.toWebHandler`.
- Streaming: bodies pass through `fromWeb` as-is; `HttpEffect.scopeTransferToStream` is the documented escape hatch if ever needed.

## 5. Module 4 — Session middleware ([#10](https://github.com/brandhaug/effectful-better-auth/issues/10))

- **Two factory-minted variants, both `$Infer`-typed** (plugin-widened session/user fields flow through):
  - `CurrentSession` — fails typed `Unauthorized` when `getSession` resolves `null` (Better Auth does not throw for missing sessions; the middleware owns this error).
  - `CurrentSessionOption` — provides `Option<Session>` for endpoints serving both audiences.
- Built on v4 `HttpApiMiddleware.Service` (wraps the endpoint response effect), reading the session through the effectful `api` proxy so failures follow §3.
- **Cookie-cache flags** (`disableCookieCache`, `disableRefresh`) are middleware-constructor options, defaulting off; per-route freshness gets a second instance.
- **Redirects stay app-side.** The middleware is transport-typed only; navigation gates belong to the application.

## 6. Config/options boundary ([#8](https://github.com/brandhaug/effectful-better-auth/issues/8))

- **The library defines zero Config keys and reads no environment.** `make`/`service` accept a plain options object or an effectful options builder (`Effect<O, E, R>`); builder requirements flow into the layer's `R` channel. Consumers read their own `Config` with their own key names — Workers-safe by construction.
- Type-bearing options (the `plugins` array above all) stay literal values the compiler can see.
- **No database code:** consumers construct `database: drizzleAdapter(db, …)` (or any adapter) inside the builder from their own services. The package never runs migrations.

## 7. Implementation phasing

1. **Phase 1:** Modules 1 + 2 (factory + effectful api) — smallest useful surface; dogfood candidate: replacing `requireRequestSession`/`getSession` glue in a consuming app.
2. **Phase 2:** Modules 3 + 4 (mount + middleware).

## 8. Non-goals

- Re-expressing Better Auth's ~33+ endpoints as HttpApi contract routes (the mounted opaque handler is the honest boundary).
- Bundling database drivers or adapters; running migrations.
- Owning env-var naming or reading configuration.
- Client-side (`createAuthClient`) integration — server only, for now.

## 9. Amendments

- **2026-09-04** (dogfooding in `b2b-saas-starter`, no issue): five additions, each removing a workaround observed in a real consumer. (1) The `full` surface (`auth.full` / `fullApi` / `FullApi`) covers `returnHeaders` — the largest raw-instance bypass category (§3). (2) `runAuth` provides its `headers` as ambient `CurrentHeaders` and gains `requireHeaders: true`, failing a typed `MissingRequestHeaders` (replacing hand-rolled "missing request headers" throws at the promise seam); `build`'s legacy `headers` parameter — an echo of the caller's own value once ambient injection exists — was cut in the same stroke, leaving `build: (api) => …` the sole contract. (3) `handleWebRequest(Tag, request)` collapses the repeated `fromWeb`/`provideService`/`toWeb` mount plumbing (§4). (4) `toCallback({ runtime, onDrop })` bridges better-auth's plain-function callbacks (emails, `databaseHooks`, background tasks) onto a `ManagedRuntime` — `awaited` propagates failures, `detached` never rejects and reports squashed failures/defects to `onDrop` (default `console.error`); deliberately promise-land at that one boundary, and documented to never point at the auth instance's own runtime when the callbacks build it. (5) A test kit: `signUpSession` (built on `full`), `cookiePairs`, `cookieHeader`, `mergeCookiePairs` — cookie rotation threading every live suite was hand-rolling. The kit carries the library's single documented cast for accessing a core endpoint across a generic-`Instance` boundary (endpoint inference collapses for unresolved `O`).

- **2026-07-28** ([#12](https://github.com/brandhaug/effectful-better-auth/issues/12)): the effectful `api` proxy replaced the `call` combinator as the sole invocation idiom (raw `instance` as the single escape hatch); the erased interop tag was cut as vestigial; the package was renamed from `@brandhaug/better-auth-effect` to unscoped `effectful-better-auth` for discoverability, with the GitHub repo renamed to match. Driven by the ease-of-adoption priority; typing validated on the prototype branch.
