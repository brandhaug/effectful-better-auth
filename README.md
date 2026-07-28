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

See [SPEC.md](./SPEC.md) for the full design. Phase 2 (handler mount, `CurrentSession` middleware) is not implemented yet.
