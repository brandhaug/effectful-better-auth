# Prior-art scan: generic instance typing in Effect wrapper libs + npm naming

Resolves issue #4. Researched 2026-07-28 against Effect v4 (`effect@4.x` typings), the Effect-TS monorepo, effect-aws, and @effect/sql-drizzle sources, plus the npm registry.

## Part 1 — How Effect wrapper libraries preserve consumer-inferred instance types

The core problem: `betterAuth(options)` infers its return type from the options object (notably the `plugins` array), so a fixed `Context.Service<BetterAuthInstance>` erases plugin-contributed surface (`auth.api.*` endpoints, `$Infer` types). Three patterns exist in the wild.

### Pattern A — Library exports a generic `make` effect; consumer owns the tag

Prior art: **@effect/sql-drizzle**. Its dist typings expose a schema-generic constructor next to a schema-erased convenience tag:

```ts
// @effect/sql-drizzle/Sqlite (dist/dts/Sqlite.d.ts)
export declare const make: <TSchema extends Record<string, unknown> = Record<string, never>>(
  config?: Omit<DrizzleConfig<TSchema>, "logger">
) => Effect.Effect<SqliteRemoteDatabase<TSchema>, never, Client.SqlClient>

export declare class SqliteDrizzle extends SqliteDrizzle_base {} // schema-erased
export declare const layer: Layer.Layer<SqliteDrizzle, never, Client.SqlClient>
```

Consumers who want schema typing skip the built-in tag and define their own service around `make<TSchema>` — the same move Effect's docs recommend for Drizzle/Prisma-style plugin-inferred instances. Applied to Better Auth (Effect v4 tag API):

```ts
// library
export const make = <const O extends BetterAuthOptions>(
  options: O
): Effect.Effect<ReturnType<typeof betterAuth<O>>> =>
  Effect.sync(() => betterAuth(options))

// consumer — full plugin inference preserved in the service shape
const options = { plugins: [organization(), twoFactor()], ... } satisfies BetterAuthOptions

class Auth extends Context.Service<Auth, Effect.Success<ReturnType<typeof make<typeof options>>>>()(
  "app/Auth"
) {}

const AuthLive = Layer.effect(Auth, make(options))
```

Trade-offs:
- Inference reliability: excellent — the instance type flows through one generic call; no re-declaration.
- Ergonomics: some consumer boilerplate (a class + a layer per app); the library cannot ship pre-bound accessors or middleware keyed to a canonical tag.
- Multi-instance: natural — one class per instance, distinct string keys.

### Pattern B — Generic factory returning `{ Tag, layer, accessors }`

Library-side factory that mints a tag whose service type is inferred from the options passed in:

```ts
// library
export const service = <const O extends BetterAuthOptions>(id: string, options: O) => {
  type Instance = ReturnType<typeof betterAuth<O>>
  const Tag = Context.Service<Instance>(id) // v3: Context.GenericTag<Instance>(id)
  return {
    Tag,
    layer: Layer.sync(Tag, () => betterAuth(options)),
    call: <A>(f: (api: Instance["api"]) => Promise<A>) =>
      Effect.flatMap(Tag, (auth) =>
        Effect.tryPromise({ try: () => f(auth.api), catch: (e) => new BetterAuthError({ cause: e }) })
      ),
  } as const
}

// consumer
export const Auth = BetterAuthEffect.service("app/Auth", { plugins: [organization()] })
// Auth.Tag, Auth.layer, Auth.call((api) => api.createOrganization(...)) — all plugin-typed
```

Prior art for value-carried type inference: Effect's own **HttpApiBuilder** derives phantom-typed service keys from a passed value rather than a fixed tag —

```ts
// effect/unstable/httpapi/HttpApiBuilder.d.ts
export declare const group: <ApiId extends string, Groups extends HttpApiGroup.Any, const Name extends HttpApiGroup.Name<Groups>, Return>(
  api: HttpApi.HttpApi<ApiId, Groups>, groupName: Name, build: ...
) => Layer.Layer<HttpApiGroup.ApiGroup<ApiId, Name>, ...>
```

`HttpApiGroup.ToService<Id, Groups>` maps the value's type parameters to service identifiers — the "pass the value, infer the requirements" idiom. `@effect/cluster`'s `Entity.make` and `@effect/rpc`'s `RpcClient.make(group)` follow the same shape.

Trade-offs:
- Ergonomics: best one-liner DX; library controls the whole surface (accessors, error mapping).
- Inference reliability: good, but the returned object's type is anonymous and enormous (Better Auth instances are deeply structural); consumers re-exporting it can hit TS4023 "type cannot be named" unless the library exports named helper types (`export type Service<O> = ...`). Large structural types also cost compile time.
- Multi-instance: trivial (distinct `id` strings), but string-key uniqueness is on the consumer; two factories with the same id silently share a context slot (documented gotcha in Effect v4 `Context.Service`).

### Pattern C — Fixed tag with an erased base interface (the baseline that loses plugin typing)

Prior art: **effect-aws** and **@effect/sql**. Every effect-aws client pins a hand-written interface to a fixed tag:

```ts
// effect-aws packages/client-dynamodb/src/DynamoDBService.ts
export class DynamoDBService extends Effect.Tag("@effect-aws/client-dynamodb/DynamoDBService")<
  DynamoDBService,
  DynamoDBService$
>() {
  static readonly defaultLayer = Layer.effect(this, makeDynamoDBService).pipe(...)
  static readonly layer = (config: DynamoDBService.Config) => ...
}
```

This works because AWS client surfaces are closed — no consumer-supplied plugins alter the type. For Better Auth, a fixed `BetterAuthInstance` tag would type `auth.api` as the pluginless base and force casts. Only viable as an *interop* tag: a canonical erased tag that middleware/ecosystem packages can depend on, alongside Pattern A/B for the typed instance. (@effect/sql-drizzle ships exactly this combination: erased `SqliteDrizzle` tag for convenience + generic `make` for typed use.)

### Recommendation shape

Combine A and B: export a generic `make(options)` effect (Pattern A) as the primitive, a `service(id, options)` factory (Pattern B) as the convenience layer, and optionally one erased interop tag (Pattern C) that the typed layer also provides for middleware such as a `CurrentSession` HttpApi middleware. Export named helper types (`BetterAuthEffect.Instance<O>`, `BetterAuthEffect.Service<O>`) to avoid TS4023 at consumer module boundaries.

## Part 2 — npm name availability (checked via `npm view`, 2026-07-28)

| Name | Status | Notes |
| --- | --- | --- |
| `better-auth-effect` | **Taken** | v0.4.1, last modified 2026-03-05, "Better Auth adapter for @effect/sql" by alx-g (github.com/alex-golubev/better-auth-effect-adapter). Active, not deprecated — a real collision, not a dead squat. |
| `effect-better-auth` | **Taken** | v0.1.0, 2025-11-06, ryanjhunter (github.com/artimath/effect-better-auth). Stale single release — could try an npm dispute/adoption, slow and uncertain. |
| `@effect/better-auth` | Unpublished, **unavailable** | `@effect` scope belongs to Effect-TS core team; not open to third parties. |
| `@better-auth/effect` | Unpublished, **unavailable** | `@better-auth` scope owned by the Better Auth team (bekacru). Would require upstream adoption. |
| `effect-auth` | **Taken** | v0.5.0, 2026-05-18, unrelated project. |
| `better-auth-effect-adapter` | **Available** (404) | Ironically free even though the taken `better-auth-effect` repo uses this name on GitHub. Risky/confusing — avoid. |
| `better-auth-adapter-effect` | **Available** (404) | Clunky. |
| `effectful-better-auth` | **Available** (404) | Reads well; "effectful" signals Effect-TS without colliding. |
| `better-auth-effectful` | **Available** (404) | Alternative ordering of the above. |

Naming takeaway: both obvious unscoped names are gone and both relevant org scopes are closed. Best available options are `effectful-better-auth` (or `better-auth-effectful`), or publishing under a personal scope, e.g. `@brandhaug/better-auth-effect`, keeping the GitHub repo name as-is. A name dispute for the dead `effect-better-auth@0.1.0` is a possible but slow parallel track.

## Sources

- @effect/sql-drizzle dist typings: https://unpkg.com/@effect/sql-drizzle/dist/dts/Sqlite.d.ts
- effect-aws DynamoDB client: https://github.com/floydspace/effect-aws/blob/main/packages/client-dynamodb/src/DynamoDBService.ts
- Effect v4 `Context.Service` / `HttpApiBuilder` typings: local `effect@4.x` dist (`dist/Context.d.ts`, `dist/unstable/httpapi/HttpApiBuilder.d.ts`, `HttpApiGroup.d.ts`)
- npm registry via `npm view <name>` (404 = available), 2026-07-28
