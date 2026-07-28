# Effect v4 platform HTTP surface

Research for issue #3. Surveyed against `effect@4.0.0-beta.93` (installed package inspection), the official v3-to-v4 migration guide, and the Effect-TS/effect repository.

## What "v4" means today

- Effect v4 development happened in `Effect-TS/effect-smol`, which is now **archived**; v4 lives on the `main` branch of the canonical [Effect-TS/effect](https://github.com/Effect-TS/effect) repo (v3 is maintained on the `v3` branch). Current releases are `effect@4.0.0-beta.x`.
- **`@effect/platform` was dissolved.** Its modules were folded into the core `effect` package: HTTP lives under `effect/unstable/http` (server + client primitives) and `effect/unstable/httpapi` (the schema-first HttpApi framework). "unstable" is a namespace signal, not a separate package.
- Full server-side module list under `effect/unstable/http`: `Cookies`, `Etag`, `FetchHttpClient`, `FindMyWay`, `Headers`, `HttpBody`, `HttpClient*`, `HttpEffect`, `HttpIncomingMessage`, `HttpMethod`, `HttpMiddleware`, `HttpPlatform`, `HttpRouter`, `HttpServer`, `HttpServerError`, `HttpServerRequest`, `HttpServerRespondable`, `HttpServerResponse`, `HttpStaticServer`, `HttpTraceContext`, `Multipart`, `Template`, `Url`, `UrlParams`. Under `effect/unstable/httpapi`: `HttpApi`, `HttpApiBuilder`, `HttpApiClient`, `HttpApiEndpoint`, `HttpApiError`, `HttpApiGroup`, `HttpApiMiddleware`, `HttpApiScalar`, `HttpApiSchema`, `HttpApiSecurity`, `HttpApiSwagger`, `HttpApiTest`, `OpenApi`.

## HttpApp → HttpEffect

The `HttpApp` module and its type aliases are gone. In v4 an HTTP app is just an ordinary Effect: `Effect.Effect<HttpServerResponse, E, R | HttpServerRequest>`. Boundary combinators moved to **`effect/unstable/http/HttpEffect`**:

- `HttpEffect.toWebHandler(self, middleware?)` → `(request: Request) => Promise<Response>` (was `HttpApp.toWebHandler`)
- `HttpEffect.toWebHandlerWith(context)(self, middleware?)` — supply a `Context` (replaces `HttpApp.toWebHandlerRuntime`; `Runtime` itself was removed in v4)
- `HttpEffect.toWebHandlerLayer` / `toWebHandlerLayerWith` — build the handler from a `Layer`, returning handler + dispose lifecycle
- `HttpEffect.fromWebHandler(handler)` — wrap an existing `(Request) => Promise<Response>` (e.g. Better Auth's `auth.handler`) as an `Effect<HttpServerResponse, HttpServerError, HttpServerRequest>`
- `HttpEffect.appendPreResponseHandler` / `withPreResponseHandler` (replaces the v3 `HttpApp.currentPreResponseHandlers` FiberRef)
- `HttpEffect.scopeDisableClose`, `HttpEffect.scopeTransferToStream` (renamed `ejectDefaultScopeClose` / `unsafeEjectStreamScope`) — request-scope control for streaming responses
- `HttpEffect.toHandled(self, handleResponse, middleware?)` — run an app and send the response through a supplied sender

## HttpRouter: v3's HttpLayerRouter became THE router

v3 had two routers: the immutable-value `HttpRouter` and the newer layer-oriented `HttpLayerRouter`. In v4 they were **consolidated: the layer-oriented router is the sole `HttpRouter` implementation** (`effect/unstable/http/HttpRouter`). There is no `HttpLayerRouter` module in v4; every `HttpLayerRouter.*` API maps to `HttpRouter.*` (`make`, `serve`, `toWebHandler`, `cors`, `schemaJson`, `schemaNoBody`, `RouteContext`, `PathInput`, `RouterConfig`, `addHttpApi` → `HttpApiBuilder.layer`). `HttpMultiplex` was removed with no replacement.

Key v4 `HttpRouter` surface:

- `HttpRouter.HttpRouter` — a `Context.Service`; the mutable registration service (v3's `HttpRouter.Tag` / custom router tags are gone; one singleton router)
- `HttpRouter.add(method, path, handler, options?)` / `addAll(routes)` — return **Layers** that register routes (v3's `HttpRouter.get/post/all` immutable combinators are gone; `all` → `add("*", ...)`)
- `HttpRouter.use(f)` — layer from a function over the router service
- `HttpRouter.route(method, path, handler)`, `prefixPath`, `prefixRoute`
- `HttpRouter.middleware` — router-level middleware (with `.Fn` type for standalone functions); `HttpRouter.cors(options?)` — CORS layer
- `HttpRouter.provideRequest(layer)` — provide **request-scoped** services to route handlers (this is how cross-cutting per-request services are wired in v4, instead of `Layer.provide`)
- `HttpRouter.serve(appLayer, options?)` — serve via an `HttpServer`
- `HttpRouter.toHttpEffect(appLayer)` — turn the assembled route layer into a plain HTTP effect (replaces `HttpApiBuilder.httpApp`)
- `HttpRouter.toWebHandler(appLayer, options?)` → `{ handler: (Request) => Promise<Response>, dispose: () => Promise<void> }` (replaces both `HttpLayerRouter.toWebHandler` and `HttpApiBuilder.toWebHandler`)
- `HttpRouter.disableLogger` layer; params/schema helpers `params`, `schemaJson`, `schemaParams`, `schemaPathParams`, `schemaNoBody`

Composition model: routes, middleware, and whole HttpApis are all Layers that register into the shared `HttpRouter` service; `Layer.mergeAll` composes them, and `toWebHandler` / `serve` materialize the app.

## HttpApiMiddleware (effect/unstable/httpapi/HttpApiMiddleware)

- v3 `HttpApiMiddleware.Tag` → **`HttpApiMiddleware.Service`**; `TagClass` → `ServiceClass`. Definition style:
  `class Auth extends HttpApiMiddleware.Service<Auth, { provides: CurrentUser; requires: ...; clientError: ... }>()("Auth", { error, security, requiredForClient })`.
- The middleware model changed: a v4 middleware is a function that **wraps the endpoint's response effect** — `(httpEffect: Effect<HttpServerResponse, unhandled, Provides>, { endpoint, group }) => Effect<HttpServerResponse, ...>` — rather than v3's provide-only shape. It carries provided services, required services, a typed error schema, and optional `HttpApiSecurity` schemes (`isSecurity` guard; `securityDecode` lives in `HttpApiBuilder`).
- Extras: `HttpApiMiddleware.layerSchemaErrorTransform` (transform `HttpApiSchemaError` failures), `HttpApiMiddleware.layerClient` (client-side counterpart for generated `HttpApiClient`s).
- Middleware declared on the contract is applied while routes are built; for additional/global middleware use `HttpRouter.middleware`. `HttpApiBuilder.buildMiddleware` and `middlewareCors` were removed (use `HttpRouter.cors`).

## HttpServerRequest ⇄ web Request, HttpServerResponse ⇄ web Response

All in `effect/unstable/http`, runtime-agnostic — verified **zero `node:` imports** in `HttpRouter`, `HttpEffect`, `HttpServerRequest`, `HttpServerResponse`, and `HttpApiBuilder` (Workers-safe):

- `HttpServerRequest.fromWeb(request: Request): HttpServerRequest`
- `HttpServerRequest.toWeb(self, options?): Request` and `toWebResult` — if the request's `source` is already a web `Request` it is returned unchanged (true on Workers, where the whole pipeline is web-native)
- `HttpServerResponse.fromWeb(response: Response): HttpServerResponse`
- `HttpServerResponse.toWeb(response, options?): Response`

This round-trip is exactly what a Better Auth integration needs: inside an Effect handler, `HttpServerRequest.toWeb` the incoming request, call `auth.handler(webRequest)`, then `HttpServerResponse.fromWeb` the result — or wrap the whole thing with `HttpEffect.fromWebHandler`.

## Streaming response bodies

- `HttpServerResponse.stream(body: Stream.Stream<Uint8Array, E>, options?)` — stream body; also `htmlStream`, `raw`, `file`, `fileWeb` (file responses need the `HttpPlatform` + `FileSystem` + `Path` + `Etag` services)
- `HttpEffect.scopeTransferToStream(response)` transfers request-scope closure to the streaming response so resources stay alive until the stream completes
- On Workers, satisfy the platform requirement without Node via `FileSystem.layerNoop({})`, `Path.layer`, `Etag.layer`, `HttpPlatform.layer` (`FileSystem`/`Path` are core `effect` root modules in v4)

## HttpApi framework (effect/unstable/httpapi)

- `HttpApiBuilder.layer(api, { openapiPath? })` registers the whole API with the shared `HttpRouter` (replaces `HttpApiBuilder.api` + the API-specific `HttpApiBuilder.Router` tag, both removed)
- `HttpApiBuilder.group(api, name, handlers)` per contract group; `HttpApiScalar.layer(api, { path })` / `HttpApiSwagger.layer(api, ...)` contribute docs routes directly to the router (the `layerHttpLayerRouter` duplicates were removed)
- End-to-end web handler: `HttpRouter.toWebHandler(apiLayer)`

## Real-world reference

`/Users/brandhaug/IdeaProjects/b2b-saas-starter/apps/api/src/http.ts` runs this exact stack on Cloudflare Workers: `HttpApiBuilder.layer` + `HttpApiScalar.layer`, request-scoped capabilities via `HttpRouter.provideRequest`, Workers-safe platform via `FileSystem.layerNoop`, and `HttpRouter.toWebHandler(layer, { disableLogger: true })` returning `{ handler, dispose }` for the Worker `fetch` export.

## Sources

- Installed package: `effect@4.0.0-beta.93` (`node_modules/effect/dist/unstable/{http,httpapi}` type declarations)
- Migration guide: <https://github.com/Effect-TS/effect/blob/main/migration/v3-to-v4.md> (per-API mappings for HttpApp, HttpRouter, HttpLayerRouter, HttpApiBuilder, HttpApiMiddleware)
- Repo status: <https://github.com/Effect-TS/effect-smol> (archived; v4 moved to Effect-TS/effect `main`, v3 on `v3` branch)
- Docs: <https://effect.website>
