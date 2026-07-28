/**
 * TS4023/TS2742 probe (SPEC §2): a consumer module compiled with
 * declaration emit that re-exports a `service(...)` result. The named
 * helper types must keep the inferred type nameable.
 */
import { memoryAdapter } from 'better-auth/adapters/memory'
import { admin } from 'better-auth/plugins/admin'
import { username } from 'better-auth/plugins/username'
import { route, service, sessionMiddleware, toHttpEffect } from '../../src/index.js'

export const Auth = service('probe/Auth', {
  secret: 'declaration-probe-secret-32-chars!!',
  baseURL: 'http://localhost:3000',
  emailAndPassword: { enabled: true },
  database: memoryAdapter({}),
  plugins: [username(), admin({ adminRoles: ['admin'] })]
})

// Phase 2 surface: re-exported mount and middleware results must stay
// nameable under declaration emit as well.
export const authHttpEffect = toHttpEffect(Auth.Tag)

export const authRoute = route(Auth.Tag)

export const AuthSession = sessionMiddleware('probe/AuthSession', Auth.Tag)

export const FreshSession = sessionMiddleware('probe/FreshSession', Auth.Tag, {
  disableCookieCache: true,
  disableRefresh: true
})
