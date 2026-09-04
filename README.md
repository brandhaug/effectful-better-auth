# effectful-better-auth

[![npm](https://img.shields.io/npm/v/effectful-better-auth)](https://www.npmjs.com/package/effectful-better-auth)
[![license](https://img.shields.io/npm/l/effectful-better-auth)](./LICENSE)

[Effect](https://effect.website) v4 integration for [Better Auth](https://better-auth.com). ESM-only, zero runtime dependencies; `effect` and `better-auth` are peers.

## Installation

```sh
bun add effectful-better-auth
# or: npm install / pnpm add / yarn add
```

Requires `better-auth ^1.6.0` and `effect ^4.0.0-rc.111` as peer dependencies.

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

`service` (and `make`) infer the instance type from your literal options, so plugin endpoints (`auth.api.listUsers`, …) are fully typed with zero per-plugin code — and absent when the plugin is not in `plugins`. The service provides three members: `api` (the one invocation idiom), `full` (the same calls resolving with the response headers), and `instance` (the raw better-auth instance, the escape hatch for `asResponse` and `auth.handler`).

## Errors

Failures carry `statusCode`, `code` (matching `$ERROR_CODES`), `message`, and `headers` — discriminate on `statusCode`/`code`, never `message`:

```ts
firstAdmins.pipe(
	Effect.catchTag('BetterAuthApiError', (e) =>
		e.statusCode === 401 ? Effect.succeed([]) : Effect.fail(e)
	)
)
```

## Full results: data and response headers

Sign-up sets the session cookie, TOTP enable/verify rotates it, SSO keeps state in one, passkey ceremonies thread challenge cookies — all of that rides the response `Set-Cookie` headers, which the data-only `api` cannot carry. `auth.full` is the same proxy with `returnHeaders: true` injected: every call resolves with `{ headers, response }`.

```ts
const { headers, response } =
	yield *
	auth.full.signUpEmail({
		body: { email: 'demo@example.com', name: 'Demo', password: 'password123' }
	})
const cookie = headers
	.getSetCookie()
	.map((c) => c.split(';')[0])
	.join('; ')
```

Ambient `CurrentHeaders` injection, explicit per-call headers, and the `BetterAuthApiError` policy are identical to `api`. Raw `Response`s and redirect flows (`asResponse`, `auth.handler`) still belong to the raw instance: `auth.instance.handler(request)`.

## Ambient request headers

In a web-request context you don't have to thread `headers` into every call: provide `CurrentHeaders` once and any `auth.api.*` call whose options omit `headers` picks them up automatically. Explicit per-call headers still win; when the service is absent the calls pass through untouched. `headers` is optional on the effectful api, so `getSession({ query })` — or even `getSession()` — compiles.

```ts
import { Effect } from 'effect'
import { CurrentHeaders } from 'effectful-better-auth'

const session = Effect.gen(function* () {
	const auth = yield* Auth.Tag
	return yield* auth.api.getSession({}) // headers injected from context
}).pipe(Effect.provideService(CurrentHeaders, new Headers(request.headers)))
```

## Server-side calls

For `auth.api.*` calls outside the Effect world (server functions, loaders, jobs), `runAuth` collapses the `runtime.runPromise(Effect.flatMap(Tag, …))` boilerplate into a single await. It resolves with the value `build` returns; failures reject with the underlying `BetterAuthApiError` unwrapped, so callers discriminate on `statusCode`/`code` directly.

`build` receives the effectful `api` and nothing else: `headers` is provided as ambient `CurrentHeaders`, so calls inside `build` that omit `headers` pick the cookie jar up automatically, with no per-call threading (close over your own `headers` for anything that needs the raw value). Explicit per-call headers still win. `requireHeaders: true` flips a missing `headers` into a typed `MissingRequestHeaders` rejection instead of letting the call proceed against an empty cookie jar.

```ts
import { runAuth } from 'effectful-better-auth'

const session = await runAuth({
	tag: Auth.Tag,
	runtime, // ManagedRuntime.make(Auth.layer)
	headers: new Headers({ cookie }),
	requireHeaders: true,
	build: (api) => api.getSession() // headers injected from `headers`
})
```

## Options as an Effect

`service(id, options)` and `make(options)` also accept an effectful options builder (`Effect<Options, E, R>`); its requirements flow into the layer, so you can read your own config and build your database adapter from your own services. The library reads no environment and defines no Config keys.

When options are built in a function (including an effectful builder), wrap the plugin array with the `plugins(...)` helper — a bare array literal widens to a union array there, which silently drops plugin schema inference (plugin-added fields like the admin plugin's `user.role` vanish from `Session`):

```ts
import { plugins, service } from 'effectful-better-auth'

const build = Effect.gen(function* () {
	const config = yield* MyConfig
	return {
		secret: config.secret,
		baseURL: config.baseURL,
		emailAndPassword: { enabled: true },
		database: myAdapter(config),
		plugins: plugins(username(), admin({ adminRoles: ['admin'] }))
	}
})

export const Auth = service('app/Auth', build)
```

## Better Auth callbacks

Better Auth invokes its hooks — email senders, `databaseHooks`, `advanced.backgroundTasks.handler` — as plain functions outside any Effect context: no ambient runtime, no Clock, no telemetry. `toCallback` hands those seams a runtime, with one bridge per callback contract:

- `awaited` — callbacks better-auth awaits (email senders, `databaseHooks`): resolves with the effect's value, rejects with its failure so better-auth propagates the error.
- `detached` — fire-and-forget callbacks (background tasks): never rejects; failures and defects — including the runtime's own layer failures — are squashed and reported to `onDrop` (default: `console.error`), so nothing vanishes silently.

```ts
import { toCallback } from 'effectful-better-auth'

const callbacks = toCallback({
	runtime: emailRuntime, // ManagedRuntime over your email services
	onDrop: (error) => reportDroppedAuthCallback(error)
})

export const auth = betterAuth({
	// …
	sendVerificationEmail: callbacks.awaited((user, url) =>
		sendVerificationEmail({ to: user.email, url })
	),
	advanced: {
		backgroundTasks: {
			handler: callbacks.detached((task) => runAuthTask(task))
		}
	}
})
```

The runtime is whatever the callbacks need. It must not be the auth instance's own runtime when the callbacks participate in building that instance — that circle does not close; hand the callbacks a runtime over the _other_ services they use.

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

When the handler already holds a plain web `Request` and wants a plain `Response` back — TanStack Start route handlers, RFC 8414 well-known paths mounted outside the catchall — `handleWebRequest(Tag, request)` collapses the `fromWeb`/`provideService`/`toWeb` plumbing:

```ts
import { Effect } from 'effect'
import { handleWebRequest } from 'effectful-better-auth'
import { Auth } from './auth.js'

const response = await Effect.runPromise(
	handleWebRequest(Auth.Tag, request).pipe(Effect.provide(Auth.layer))
)
```

Rate limiting, logging, and audit wrap the plain Effect with standard Effect/HttpRouter middleware on your side — the mount has no hooks of its own.

## Protecting endpoints

`sessionMiddleware(id, Tag)` mints two `HttpApiMiddleware` variants, both typed from your instance's `$Infer` session (plugin-widened fields flow through):

- `CurrentSession` — provides the session to handlers; fails a typed `Unauthorized` (rendered 401) when there is no session.
- `CurrentSessionOption` — provides `Option<Session>`; never fails on a missing session.

Transport failures surface as `BetterAuthApiError`, untouched. The middleware never redirects — navigation gates belong to your application.

```ts
import { Effect, Layer, Option, Schema } from 'effect'
import {
	HttpApi,
	HttpApiBuilder,
	HttpApiEndpoint,
	HttpApiGroup
} from 'effect/unstable/httpapi'
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

## Testing helpers

`signUpSession(Tag, { email, password })` — the one flow every live suite needs — signs a user up over email + password through the `full` surface and hands back `{ userId, headers, cookieHeader, cookiePairs }`. The cookie helpers thread later rotations:

```ts
import {
	cookieHeader,
	cookiePairs,
	mergeCookiePairs,
	signUpSession
} from 'effectful-better-auth'

const signUp =
	yield *
	signUpSession(Auth.Tag, {
		email: 'demo@example.com',
		password: 'password123'
	})

const rotated =
	yield *
	auth.full.twoFactorEnable({
		headers: signUp.headers
	})
const merged = mergeCookiePairs(
	signUp.cookiePairs,
	cookiePairs(rotated.headers)
)
const session =
	yield *
	auth.api.getSession({
		headers: new Headers({ cookie: cookieHeader(merged) })
	})
```

`mergeCookiePairs` merges last-write-wins per cookie name, so the rotation's token replaces its own while unrelated cookies survive. `signUpSession` requires `emailAndPassword: { enabled: true }`; a sign-up that sets no cookie dies — a broken fixture should fail exactly the test that used it.

See [SPEC.md](./SPEC.md) for the full design.

## Contributing

Issues and pull requests are welcome at [brandhaug/effectful-better-auth](https://github.com/brandhaug/effectful-better-auth). Run the checks locally before submitting:

```bash
bun run typecheck && bun run test
```

## License

[MIT](./LICENSE)
