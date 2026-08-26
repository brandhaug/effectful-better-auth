import { Context } from 'effect'

/**
 * Ambient request headers (SPEC §3): when this service is provided in the
 * effect's context, `auth.api.*` calls whose options omit `headers` pick it
 * up automatically. Explicit per-call headers still win; when absent the
 * calls pass through untouched.
 */
export const CurrentHeaders: Context.Service<Headers, Headers> =
  Context.Service<Headers>('~effectful-better-auth/CurrentHeaders')
