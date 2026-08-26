# Prompt: implement phase 2 of effectful-better-auth

Copy everything below into a fresh agent session in this repo.

---

Implement **phase 2** of `effectful-better-auth` — the runtime-agnostic handler mount and the session middleware — exactly as specified in `SPEC.md` (§4, §5), building on the phase 1 surface that already exists in `src/`. Do not change phase 1's public API (`make`, `service`, `effectApi`, `BetterAuthApiError`, the named types) except to add exports.

## Read first, in this order

1. `SPEC.md` §4 (handler mount) and §5 (session middleware) — the contract. §3's error rules and §6's boundaries still bind. Do not relitigate decisions; if you hit a real contradiction or gap, stop and ask.
2. The phase 1 source, especially `src/factory.ts` and `src/types.ts` — the mount and middleware are minted from the same `Tag<O>` whose service shape is `{ api: Api<O>, instance: Instance<O> }`. The raw handler lives at `service.instance.handler`; the session read goes through `service.api.getSession` (the effectful proxy), so its failures already follow §3.
3. The Effect v4 HTTP survey — exact module names, what changed from v3, and the fromWeb/toWeb round-trip:
   `git show origin/research/effect-v4-http-surface:docs/research/effect-v4-http-surface.md`
4. A production reference for the v4 server stack on Cloudflare Workers (read-only, do not modify that repo):
   `/Users/brandhaug/IdeaProjects/b2b-saas-starter/apps/api/src/http.ts` and `handlers.ts`.

## Deliverables

- `src/mount.ts` (SPEC §4):
  - `toHttpEffect(Tag)` — a plain v4 HTTP effect: `Effect<HttpServerResponse, E, HttpServerRequest | Service<O>>`. Implementation: `HttpServerRequest.toWeb` the incoming request → `service.instance.handler(webRequest)` → `HttpServerResponse.fromWeb` the result. Wrap the handler promise so a rejection is a defect (better-auth's `handler` resolves error *responses*; a rejected promise is a bug), consistent with §3's defect policy.
  - `route(Tag, options?)` — a Layer registering `HttpRouter.add('*', '<basePath>/*', ...)` on the v4 singleton router. `basePath` defaults from the instance's better-auth options (`options.basePath ?? '/api/auth'`); an explicit `options.basePath` on `route` overrides. No other configuration surface — middleware, rate limiting, and logging are the consumer's composition, not ours.
- `src/middleware.ts` (SPEC §5):
  - A middleware factory minting the two variants from a `Tag<O>`, both `$Infer`-typed (add a named `Session<O>` helper type to `src/types.ts` derived from `Instance<O>['$Infer']['Session']`):
    - **Required**: provides the session; fails a new exported `Unauthorized` tagged error (`Schema.TaggedError`) when `getSession` resolves `null`.
    - **Optional**: provides `Option<Session<O>>`; never fails on a missing session.
  - Built on v4 `HttpApiMiddleware.Service` (a v4 middleware *wraps the endpoint's response effect* — see the survey). The factory-minted-class shape is the riskiest typing in this phase: consumers must be able to declare the middleware on their `HttpApi` contract and get the session via a context tag in handlers. **Validate this shape against the real `effect/unstable/httpapi` types before building the whole module** — if the class-generic combination fights you, a small throwaway probe first (prototype-branch style) is cheaper than a rewrite.
  - Constructor options `{ disableCookieCache?: boolean, disableRefresh?: boolean }`, defaulting off, passed through to `getSession`'s query. Session read failures (`BetterAuthApiError`) pass through untouched. No redirects — transport-typed errors only.
- Barrel: export `toHttpEffect`, `route`, `Unauthorized`, the middleware factory, and `Session<O>` from `src/index.ts`.
- Tests (extend the existing vitest setup):
  - **Mount runtime**: real `betterAuth` instance (in-memory adapter, `emailAndPassword`), materialize `toHttpEffect` with `HttpEffect.toWebHandler`, drive a sign-up → sign-in → `get-session` sequence with real requests; assert status codes and that `set-cookie` survives the fromWeb/toWeb round-trip. Also assert an unknown path under the basePath returns better-auth's own 404 (pass-through, no interception).
  - **Route layer**: assemble via `HttpRouter.toWebHandler(...)` with the `route(Tag)` layer and assert the basePath default and the override both mount correctly.
  - **Middleware**: a minimal `HttpApi` with one endpoint per variant; drive it end to end — signed-in cookie reaches the handler with a typed session; missing cookie yields the `Unauthorized` contract error (required) and `Option.none` (optional); the cookie-cache flags reach `getSession` (spy or behavioral assertion).
  - **Workers-safety**: a test that fails if any file in `src/` imports `node:*` (grep-style; keep it dumb and strict).
  - Extend the declaration probe to re-export the mount and middleware results.
- `README.md`: add a "Mounting the auth routes" section (both the `route` Layer and the `HttpEffect.toWebHandler` file-route path) and a "Protecting endpoints" section for the middleware. Keep the quickstart-first structure.

## Constraints (violations are bugs)

- No `node:*` imports in `src/` — the mount must run on Cloudflare Workers unchanged.
- No bespoke middleware hooks on the mount; no third invocation style anywhere.
- `basePath` has one source of truth (instance options), one override point (`route`).
- The middleware never redirects and never invents error shapes: `Unauthorized` for absent session, `BetterAuthApiError` passed through for transport failures.
- Streaming responses pass through `fromWeb` untouched; only reach for `HttpEffect.scopeTransferToStream` if a test proves it necessary, and document why.

## Known v4 gotchas (paid for already — don't rediscover)

- Server HTTP lives in `effect/unstable/http`; HttpApi in `effect/unstable/httpapi`. There is no `@effect/platform` and no `HttpApp` module — an app is a plain Effect; boundary fns are `HttpEffect.toWebHandler` / `fromWebHandler`.
- v4's `HttpRouter` is the layer-registering router (v3's `HttpLayerRouter`): `HttpRouter.add(...)` returns a Layer; `HttpRouter.toWebHandler(layer)` returns `{ handler, dispose }`. Request-scoped services go through `HttpRouter.provideRequest`, not `Layer.provide`.
- `HttpApiMiddleware.Service` replaced `.Tag`; the middleware function wraps the endpoint response effect rather than v3's provide-only shape.
- On Workers, `HttpServerRequest.toWeb` returns the original web `Request` unchanged — don't copy headers/body manually like the dead community package did.
- `Effect.catch` (not `catchAll`), curried `Layer.effect(Tag)(...)`, `Context.Service<Shape>(id)` vs two-stage class form, `Schema.TaggedError<Self>()(tag, fields)` — all as in phase 1's source.

## Definition of done

`bun install && bun run typecheck && bun run test && bun run build` all green from a clean checkout; declaration probe green; README sections typecheck when copied to a scratch file. Small conventional commits on a `feat/phase-2` branch, PR against master titled "feat: phase 2 — handler mount + session middleware". Do **not** publish to npm.
