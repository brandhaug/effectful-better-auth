/**
 * THROWAWAY PROTOTYPE — TS4023 probe for wayfinder ticket #6.
 *
 * Pattern B's known risk: the factory's anonymous, deeply-structural return
 * type can trigger "exported variable has or is using name from external
 * module but cannot be named" when a consumer re-exports it from a module
 * compiled with declaration emit. `tsc` runs here with `declaration`-style
 * strictness via --noEmit; the dedicated check is running tsc with
 * `declaration: true` over this file (see ticket resolution notes).
 */
import { admin } from 'better-auth/plugins/admin'
import { username } from 'better-auth/plugins/username'
import { service } from './prototype.js'

// A consumer module that re-exports the factory result — the TS4023 shape.
export const Auth = service('proto/AuthReexport', {
  secret: 'proto-secret',
  baseURL: 'http://localhost:9999',
  emailAndPassword: { enabled: true },
  plugins: [username(), admin({ adminRoles: ['admin'] })]
})
