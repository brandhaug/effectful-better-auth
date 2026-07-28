import { Schema } from 'effect'

const HeadersInitSchema = Schema.declare(
  (u): u is HeadersInit => typeof u === 'object' && u !== null
)

/**
 * The single tagged error for failing `auth.api.*` calls (SPEC §3).
 *
 * Discriminate on `statusCode` or `code` — never on `message`, which is
 * human-readable text and may be localized.
 */
export class BetterAuthApiError extends Schema.TaggedErrorClass<BetterAuthApiError>(
  'BetterAuthApiError'
)('BetterAuthApiError', {
  statusCode: Schema.Number,
  code: Schema.UndefinedOr(Schema.String),
  message: Schema.String,
  headers: HeadersInitSchema
}) {}
