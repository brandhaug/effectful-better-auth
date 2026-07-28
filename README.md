# effectful-better-auth

Effect v4 integration for [Better Auth](https://better-auth.com): a plugin-aware service/Layer factory, typed wrappers over `auth.api.*` with tagged errors, a runtime-agnostic handler mount for `@effect/platform`, and a `CurrentSession` HttpApi middleware.

Status: design locked — see [SPEC.md](./SPEC.md) for the full design (decided via the [wayfinder map](https://github.com/brandhaug/effectful-better-auth/issues/1)). Implementation phase 1 covers the service/Layer factory and the typed call wrapper; phase 2 adds the handler mount and session middleware.

## Non-goals

- Re-expressing Better Auth's endpoints as HttpApi contract routes.
- Bundling a specific database driver or running migrations at layer construction.
