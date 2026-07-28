# Prompt: implement phase 1 of effectful-better-auth

Copy everything below into a fresh agent session in this repo.

---

Implement **phase 1** of `effectful-better-auth` — the plugin-aware service/Layer factory and the effectful `api` proxy — exactly as specified in `SPEC.md` (§1, §2, §3, §6, §7). Phase 2 (handler mount, session middleware) is out of scope; do not scaffold it.

## Read first, in this order

1. `SPEC.md` — the contract. Every design decision is settled there; do not relitigate any of them. If you hit a genuine contradiction or gap, stop and ask rather than improvising.
2. The validated prototype — the typing patterns you will productionize:
   - `git show origin/prototype/typing-strategy:prototype-typing/src/prototype.ts` (patterns A/B, negative assertions, TaggedErrorClass usage)
   - `git show origin/prototype/typing-strategy:prototype-typing/src/proxy.ts` (the `EffectApi` mapped type, runtime `Proxy`, defect split, `wrap` service shape)
3. Research findings (each on its own branch, not master):
   - `git show origin/research/better-auth-api-surface:docs/research/better-auth-api-surface.md` — `auth.api` call convention, `APIError` field semantics, `isAPIError`
   - `git show origin/research/effect-v4-http-surface:docs/research/effect-v4-http-surface.md` — v4 module layout (background only for phase 1)
   - `git show origin/research/typing-prior-art-and-naming:docs/research/typing-prior-art-and-naming.md` — why the factory shape is what it is

## Deliverables

- `package.json` — name `effectful-better-auth`, ESM-only (`"type": "module"`, `exports` map with `types`), MIT license, `peerDependencies`: `effect` (v4 beta range) and `better-auth` (`^1.6.0`). Zero `dependencies`. Bun is the package manager.
- `src/` modules (suggested split — adjust if a cleaner shape emerges, but keep the public surface exactly as SPEC.md defines):
  - `errors.ts` — `BetterAuthApiError` via `Schema.TaggedErrorClass`, fields per SPEC §3 (`statusCode: number`, `code: string | undefined`, `message: string`, `headers`).
  - `effect-api.ts` — `EffectApi<Api>` mapped type + `effectApi(api)` runtime `Proxy`. `isAPIError` → `Effect.fail(BetterAuthApiError)`, anything else → `Effect.die`.
  - `factory.ts` — `make(options)` primitive and `service(id, options)` returning `{ Tag, layer }` with service shape `{ api, instance }`. Both accept a plain options object **or** an effectful options builder `Effect<O, E, R>` whose requirements flow into the layer's `R` (SPEC §6).
  - `types.ts` — the mandatory named helper types (`Instance<O>`, `Api<O>`, `Service<O>`, …) so consumer re-exports don't inline half a megabyte of declarations (SPEC §2).
  - `index.ts` — barrel; the public API is `service`, `make`, `effectApi`, `BetterAuthApiError`, and the named types. Nothing else.
- Tests (vitest; follow the Effect v4 testing conventions — deterministic, no sleeps):
  - **Type-level**: port the prototype's assertions as `*.test-d.ts` or inline `@ts-expect-error` cases — plugin endpoint present with plugins, absent without, misspelled body key rejected, error channel is exactly `BetterAuthApiError`, `getSession` keeps `| null`.
  - **Runtime**: a real `betterAuth` instance against better-auth's in-memory adapter — sign up, call a plugin endpoint through the proxy, assert a failing call yields a `BetterAuthApiError` with the right `statusCode`/`code` via `Effect.exit`, and assert a non-APIError throw becomes a defect, not a failure.
  - **Declaration probe**: a script or test running `tsc --declaration --emitDeclarationOnly` over a fixture that re-exports a `service(...)` result — must emit zero TS4023/TS2742 errors.
- `README.md` — rewrite the stub: one quickstart leading with `service(id, options)` (SPEC says docs lead with the factory), the `yield* auth.api.listUsers(...)` idiom, the `instance` escape hatch, and a short "how plugins work" note (zero per-plugin code). Keep it under a screen; link SPEC.md for the rest.

## Constraints (violations are bugs)

- No `node:*` imports anywhere in `src/`.
- The library reads no environment and defines no Config keys (SPEC §6).
- Type-bearing options (`plugins` above all) must remain literal values — never widen or clone them through a type-erasing helper.
- One invocation idiom: the proxy. Do not add a `call` combinator or any third style; the raw `instance` is the only escape hatch.
- `message` is never a discriminant; `statusCode`/`code` are.

## Known v4 gotchas (already hit during prototyping — don't rediscover them)

- `Effect.catchAll` is `Effect.catch` in v4; `Layer.effect(Tag)(effect)` and `Layer.sync(Tag)(fn)` are curried; function-style keys are `Context.Service<Shape>(id)`, class-style is the two-stage `Context.Service<Self, Shape>()(id)`.
- `Effect.Success<T>` (not `Effect.Effect.Success<T>`).
- `Schema.TaggedErrorClass<Self>(tag)(tag, fields)` is the double-call form.
- The proxy's mapped type collapses `asResponse`/`returnHeaders` generics to the data branch — that's accepted by SPEC §3, don't fight it.
- Better Auth's `APIError.status` can be a text key or number; `statusCode` is always numeric — map from `statusCode`.

## Definition of done

`bun install && bun run typecheck && bun run test && bun run build` all green from a clean checkout; the declaration probe passes; README quickstart compiles as written (copy it into a scratch file and typecheck it). Commit in small conventional commits on a `feat/phase-1` branch and open a PR against master titled "feat: phase 1 — factory + effectful api". Do **not** publish to npm.
