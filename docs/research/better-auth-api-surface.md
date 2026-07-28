# Better Auth server API surface and APIError semantics

Resolves issue #2. Verified against better-auth **1.6.23** (installed package types under
`node_modules/better-auth/dist`, `@better-auth/core@1.6.23`, `better-call@1.3.5`) and the
official docs. Sources cited inline.

## 1. What `auth.api` is

`betterAuth(options)` returns `Auth<Options>` with:

```ts
type Auth<Options> = {
  handler: (request: Request) => Promise<Response>;
  api: InferAPI<ReturnType<typeof router<Options>>["endpoints"]>;
  options: Options;
  $ERROR_CODES: InferPluginErrorCodes<Options> & typeof BASE_ERROR_CODES;
  $context: Promise<AuthContext<Options> & InferPluginContext<Options>>;
  $Infer: { Session: { session; user } } /* + plugin types */;
};
```

(`better-auth/dist/types/auth.d.mts`.)

Every route is exposed as a directly callable server function. The call convention
([docs/concepts/api](https://www.better-auth.com/docs/concepts/api)) is a single context
object with `body`, `query`, `headers`, plus two flags:

- `asResponse: true` — return the raw `Response` instead of parsed data.
- `returnHeaders: true` — return `{ headers: Headers, response: T }` (e.g. to read
  `headers.getSetCookie()`).

`getSession` gets a hand-written signature via `InferSessionAPI` (`types/api.d.mts`): it
requires `headers`, accepts `query?: { disableCookieCache?, disableRefresh? }`, and resolves
to `{ session, user } | null` (not throwing on missing session). `InferAPI = InferSessionAPI &
FilteredAPI`, where `FilteredAPI` drops endpoints whose `metadata` is `{ isAction: false }` or
`{ scope: "http" }` — those exist only as HTTP routes (e.g. OAuth callbacks are still typed
in 1.6.23 because they lack that flag, but the mechanism exists for hiding routes from
`auth.api`).

## 2. Core endpoints (base router)

From `better-auth/dist/api/index.mjs` (`getEndpoints`), the base `auth.api` map is exactly:

| Group | Methods |
| --- | --- |
| Session | `getSession`, `listSessions`, `revokeSession`, `revokeSessions`, `revokeOtherSessions`, `updateSession` |
| Sign-in/up/out | `signInEmail`, `signInSocial`, `signUpEmail`, `signOut`, `callbackOAuth` |
| Password | `requestPasswordReset`, `requestPasswordResetCallback`, `resetPassword`, `changePassword`, `setPassword`, `verifyPassword` |
| Email verification | `sendVerificationEmail`, `verifyEmail`, `changeEmail` |
| User management | `updateUser`, `deleteUser`, `deleteUserCallback` |
| Accounts (OAuth linking) | `linkSocialAccount`, `unlinkAccount`, `listUserAccounts`, `accountInfo`, `refreshToken`, `getAccessToken` |
| Misc | `ok` (`/ok`), `error` (`/error`) |

Plugin endpoints are spread into this object between `accountInfo` and `ok`.

## 3. How plugins extend the surface (types)

A `BetterAuthPlugin` carries an `endpoints: Record<string, Endpoint>` field. The router's
return type merges them structurally (`better-auth/dist/api/index.d.mts` ~line 1991):

```ts
OverrideMerge<{ /* base endpoints */ },
  UnionToIntersection<Option["plugins"] extends (infer T)[]
    ? T extends BetterAuthPlugin
      ? T extends { endpoints: infer E } ? E : {}
      : {} : {}>>
```

So `auth.api`'s type is derived purely from the `plugins` array in your options — plugin
keys override base keys on collision (`OverrideMerge`). Plugins also contribute
`$ERROR_CODES` (merged into `auth.$ERROR_CODES`), schema fields (`InferDBFieldsFromPlugins`
widens `User`/`Session` in every endpoint's input/output types), and `$Infer` types. Docs:
[concepts/typescript](https://www.better-auth.com/docs/concepts/typescript) (requires
`strict` or at least `strictNullChecks` for inference to work).

Concrete surfaces in 1.6.23 (from `dist/plugins/*`):

- **`username`**: adds `signInUsername` (`/sign-in/username`) and `isUsernameAvailable`
  (`/is-username-available`); extends the user schema with `username` / `displayUsername`
  (so `signUpEmail` and `updateUser` bodies gain those fields via schema inference).
- **`admin`**: `createUser`, `getUser` (as of 1.6.x), `listUsers`, `updateUser` (admin variant), `setRole`,
  `setUserPassword`, `banUser`, `unbanUser`, `listUserSessions`, `revokeUserSession`,
  `revokeUserSessions`, `removeUser`, `impersonateUser`, `stopImpersonating`,
  `userHasPermission` — paths `/admin/*` (15 routes).
- **`organization`**: ~30 routes under `/organization/*`: org CRUD (`create`, `update`,
  `delete`, `list`, `set-active`, `get-full-organization`, `check-slug`), members
  (`invite-member`, `accept/reject/cancel-invitation`, `get-invitation`,
  `list-invitations`, `list-user-invitations`, `list-members`, `remove-member`,
  `update-member-role`, `get-active-member`, `get-active-member-role`, `leave`), teams
  (`create-team`, `update-team`, `remove-team`, `list-teams`, `list-user-teams`,
  `add-team-member`, `remove-team-member`, `list-team-members`, `set-active-team`), and
  dynamic access control (`create-role`, `update-role`, `delete-role`, `get-role`,
  `list-roles`), plus `hasPermission`.

Endpoint names on `auth.api` are the camelCase record keys (e.g.
`auth.api.createOrganization`, `auth.api.banUser`), not the paths.

## 4. `APIError` — exact shape and provenance

Server calls **throw** on failure ([docs/concepts/api](https://www.better-auth.com/docs/concepts/api)).

Provenance chain in 1.6.23:

1. `better-call/error` defines the base class (`better-call/dist/error.d.mts`):

   ```ts
   class InternalAPIError extends Error {
     status: keyof typeof statusCodes | Status; // "UNAUTHORIZED" | 401 | ... (as constructed)
     body: ({ message?: string; code?: string; cause?: unknown } & Record<string, any>) | undefined;
     headers: HeadersInit;
     statusCode: number; // numeric, derived from status when status is a text key
     name: "APIError";
     // constructor(status = "INTERNAL_SERVER_ERROR", body?, headers = {}, statusCode?)
   }
   ```

   The exported `APIError` is this class wrapped by `makeErrorForHideStackFrame`, adding
   `errorStack: string | undefined` (internal frames hidden). `ValidationError extends
   InternalAPIError` (status 400, `body.code = "VALIDATION_ERROR"`, plus `issues:
   StandardSchemaV1.Issue[]`).

2. `@better-auth/core/error` subclasses it: `class APIError extends BetterCallAPIError`
   with statics `APIError.fromStatus(status, body?)` and `APIError.from(status, { code,
   message })`. It also exports `BASE_ERROR_CODES` (the machine-readable `code` catalog:
   `USER_NOT_FOUND`, `INVALID_EMAIL_OR_PASSWORD`, `SESSION_EXPIRED`, ...) and
   `BetterAuthError` (config-time errors, not HTTP).

3. `better-auth/api` re-exports that `APIError` plus `isAPIError(err)` — the supported
   type guard (works across realm/instanceof issues). This is the import the docs show:

   ```ts
   import { APIError, isAPIError } from "better-auth/api";
   ```

Field semantics:

- `status` — whatever the throw site passed: usually the **text key** (`"UNAUTHORIZED"`,
  `"BAD_REQUEST"`), but numeric literals are allowed. There is **no separate `statusText`
  property**; the text key in `status` plays that role.
- `statusCode` — always the numeric HTTP code (defaulted from the `statusCodes` map when
  `status` is a text key).
- `body` — `{ message?, code?, cause? } & Record<string, any>`. `message` doubles as
  `Error.message` (passed to `super`), and `code` is the stable discriminant matching
  `auth.$ERROR_CODES` / `BASE_ERROR_CODES` keys.
- `headers` — `HeadersInit` to attach to the HTTP error response.
- `name` — always `"APIError"` (useful as a structural discriminant alongside
  `isAPIError`).

Discrimination strategy for an Effect wrapper: guard with `isAPIError`, then discriminate
on `error.body?.code` (stable, plugin-extensible via `$ERROR_CODES`) with `statusCode` as
the coarse fallback. `error.message` is human text and can be localized per docs; do not
match on it.

### Version note

In better-auth ≤1.5 there was no `@better-auth/core`; `better-auth/api` re-exported
better-call's `APIError` directly. The observable shape (`status`, `statusCode`, `body`,
`headers`) is the same; the `fromStatus`/`from` statics are the 1.6 addition. Code should
import from `better-auth/api` and never from `better-call` directly.

## Sources

- Installed package types: `better-auth@1.6.23` (`dist/types/auth.d.mts`,
  `dist/types/api.d.mts`, `dist/api/index.{mjs,d.mts}`, `dist/plugins/{username,admin,organization}`),
  `@better-auth/core@1.6.23` (`dist/error/index.d.mts`, `dist/error/codes.d.mts`),
  `better-call@1.3.5` (`dist/error.{d.mts,mjs}`).
- Docs: <https://www.better-auth.com/docs/concepts/api>,
  <https://www.better-auth.com/docs/concepts/typescript>,
  plugin docs under <https://www.better-auth.com/docs/plugins/organization> et al.
- Repo: <https://github.com/better-auth/better-auth> (monorepo: `packages/better-auth`,
  `packages/core`; `better-call` is a separate package by the same author).
