# effectful-better-auth

[Effect](https://effect.website) v4 integration for [Better Auth](https://better-auth.com). ESM-only, zero runtime dependencies; `effect` and `better-auth` are peers.

```sh
bun add effectful-better-auth
```

## Quickstart

```ts
import { memoryAdapter } from 'better-auth/adapters/memory'
import { admin } from 'better-auth/plugins/admin'
import { Effect } from 'effect'
import { service } from 'effectful-better-auth'

// Mint a service: a context Tag plus a Layer. Keep options literal —
// the plugins array is what types your api surface.
export const Auth = service('app/Auth', {
  secret: 'a-secret-at-least-32-characters-long!!',
  baseURL: 'http://localhost:3000',
  emailAndPassword: { enabled: true },
  database: memoryAdapter({}),
  plugins: [admin({ adminRoles: ['admin'] })]
})

// Every auth.api endpoint is an Effect, failing with BetterAuthApiError.
export const firstAdmins = Effect.gen(function* () {
  const auth = yield* Auth.Tag
  const { users } = yield* auth.api.listUsers({ query: { limit: 10 } })
  return users
})

export const main = firstAdmins.pipe(Effect.provide(Auth.layer))
```

Failures carry `statusCode`, `code` (matching `$ERROR_CODES`), `message`, and `headers` — discriminate on `statusCode`/`code`, never `message`:

```ts
firstAdmins.pipe(
  Effect.catchTag('BetterAuthApiError', (e) =>
    e.statusCode === 401 ? Effect.succeed([]) : Effect.fail(e)
  )
)
```

## How plugins work

`service` (and `make`) infer the instance type from your literal options, so plugin endpoints (`auth.api.listUsers`, `auth.api.signInUsername`, …) are fully typed with zero per-plugin code — and absent when the plugin is not in `plugins`.

## Escape hatch

The proxy is the one invocation idiom. For raw `Response`/headers (`asResponse`, `returnHeaders`) or `auth.handler`, use the raw instance: `auth.instance.api.getSession({ headers, asResponse: true })`.

## Options as an Effect

`service(id, options)` and `make(options)` also accept an effectful options builder (`Effect<Options, E, R>`); its requirements flow into the layer, so you can read your own config and construct your database adapter from your own services. The library reads no environment and defines no Config keys.

## Mounting the auth routes

`route(Tag)` is a Layer that registers `'*' <basePath>/*` on the v4 router, forwarding everything under the base path to Better Auth's own handler. The base path derives from your better-auth options (`options.basePath ?? '/api/auth'`); `route(Tag, { basePath })` is the single override point. No `node:` imports anywhere — the mount runs on Cloudflare Workers unchanged.

```ts
import { Layer } from 'effect'
import { HttpRouter } from 'effect/unstable/http'
import { route } from 'effectful-better-auth'
import { Auth } from './auth.js'

const routes = Layer.mergeAll(
  route(Auth.Tag)
  // ...your other routes / HttpApiBuilder.layer(...)
).pipe(Layer.provide(Auth.layer))

// Worker / web-standard entrypoint:
export const { handler, dispose } = HttpRouter.toWebHandler(routes)
```

File-route frameworks (TanStack Start and friends) skip the router and materialize the primitive directly — `toHttpEffect(Tag)` is a plain v4 HTTP effect (`toWeb` the request → `auth.handler` → `fromWeb` the response, streaming bodies pass through untouched):

```ts
import { Effect } from 'effect'
import { HttpEffect } from 'effect/unstable/http'
import { toHttpEffect } from 'effectful-better-auth'
import { Auth } from './auth.js'

const handle = HttpEffect.toWebHandler(
  toHttpEffect(Auth.Tag).pipe(Effect.provide(Auth.layer))
)

export const ServerRoute = { GET: handle, POST: handle }
```

Rate limiting, logging, and audit wrap the plain Effect with standard Effect/HttpRouter middleware on your side — the mount has no hooks of its own.

## Protecting endpoints

`sessionMiddleware(id, Tag)` mints two `HttpApiMiddleware` variants, both typed from your instance's `$Infer` session (plugin-widened fields flow through):

- `CurrentSession` — provides the session to handlers; fails a typed `Unauthorized` (rendered 401) when there is no session.
- `CurrentSessionOption` — provides `Option<Session>`; never fails on a missing session.

Transport failures surface as `BetterAuthApiError`, untouched. The middleware never redirects — navigation gates belong to your application.

```ts
import { Effect, Layer, Option, Schema } from 'effect'
import { HttpApi, HttpApiBuilder, HttpApiEndpoint, HttpApiGroup } from 'effect/unstable/httpapi'
import { sessionMiddleware } from 'effectful-better-auth'
import { Auth } from './auth.js'

export const AuthSession = sessionMiddleware('app/AuthSession', Auth.Tag)

const api = HttpApi.make('app')
  .add(
    HttpApiGroup.make('account')
      .add(HttpApiEndpoint.get('me', '/me', { success: Schema.String }))
      .middleware(AuthSession.CurrentSession)
  )
  .add(
    HttpApiGroup.make('pages')
      .add(HttpApiEndpoint.get('home', '/home', { success: Schema.String }))
      .middleware(AuthSession.CurrentSessionOption)
  )

const accountLive = HttpApiBuilder.group(api, 'account', (handlers) =>
  handlers.handle('me', () =>
    Effect.gen(function* () {
      const session = yield* AuthSession.Session // typed, from $Infer
      return session.user.email
    })
  )
)

const pagesLive = HttpApiBuilder.group(api, 'pages', (handlers) =>
  handlers.handle('home', () =>
    Effect.gen(function* () {
      const session = yield* AuthSession.SessionOption
      return Option.match(session, {
        onNone: () => 'hello, stranger',
        onSome: (s) => `hello, ${s.user.name}`
      })
    })
  )
)

export const apiLive = HttpApiBuilder.layer(api).pipe(
  Layer.provide(accountLive),
  Layer.provide(pagesLive),
  Layer.provide(AuthSession.layer),
  Layer.provide(Auth.layer)
)
```

Cookie-cache freshness is a constructor concern: `sessionMiddleware(id, Tag, { disableCookieCache: true, disableRefresh: true })` forwards the flags to `getSession`. Routes needing different freshness get a second instance under a distinct id.

To materialize `apiLive` with `HttpRouter.toWebHandler`, `HttpApiBuilder` still needs the platform services; on Workers (no Node runtime) satisfy them with the no-op filesystem:

```ts
import { FileSystem, Layer, Path } from 'effect'
import { Etag, HttpPlatform } from 'effect/unstable/http'

export const PlatformLive = Layer.mergeAll(
  Path.layer,
  Etag.layer,
  FileSystem.layerNoop({}),
  HttpPlatform.layer.pipe(Layer.provide(FileSystem.layerNoop({})))
)
```

See [SPEC.md](./SPEC.md) for the full design.
