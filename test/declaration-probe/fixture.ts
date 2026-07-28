/**
 * TS4023/TS2742 probe (SPEC §2): a consumer module compiled with
 * declaration emit that re-exports a `service(...)` result. The named
 * helper types must keep the inferred type nameable.
 */
import { memoryAdapter } from 'better-auth/adapters/memory'
import { admin } from 'better-auth/plugins/admin'
import { username } from 'better-auth/plugins/username'
import { service } from '../../src/index.js'

export const Auth = service('probe/Auth', {
  secret: 'declaration-probe-secret-32-chars!!',
  baseURL: 'http://localhost:3000',
  emailAndPassword: { enabled: true },
  database: memoryAdapter({}),
  plugins: [username(), admin({ adminRoles: ['admin'] })]
})
