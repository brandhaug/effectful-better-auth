# better-auth-effect

Effect v4 integration for [Better Auth](https://better-auth.com): a plugin-aware service/Layer factory, typed wrappers over `auth.api.*` with tagged errors, a runtime-agnostic handler mount for `@effect/platform`, and a `CurrentSession` HttpApi middleware.

Status: early design. See the roadmap below.

## Roadmap

1. **Service + Layer factory** — `BetterAuth.make<...>()` returning a tag and `layer(options)` that preserve the consumer's plugin-inferred instance type. Config via `Config`, database adapter as a dependency layer.
2. **Typed call wrapper** — `call(auth => auth.api.getSession({ headers }))` mapping thrown `APIError` into `Schema.TaggedErrorClass` failures.
3. **Handler mount** — an `HttpApp` catchall converting `HttpServerRequest` to a web `Request` and delegating to `auth.handler`, runtime-agnostic (Workers included).
4. **Session middleware** — `HttpApiMiddleware` providing a `CurrentSession` tag, failing typed `Unauthorized`.

## Non-goals

- Re-expressing Better Auth's endpoints as HttpApi contract routes.
- Bundling a specific database driver or running migrations at layer construction.
