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
export class BetterAuthApiError extends Schema.TaggedError<BetterAuthApiError>(
  'BetterAuthApiError'
)('BetterAuthApiError', {
  statusCode: Schema.Number,
  code: Schema.UndefinedOr(Schema.String),
  message: Schema.String,
  headers: HeadersInitSchema
}) {}

/**
 * Failure of the required session middleware when `getSession` resolves
 * `null` (SPEC §5). Better Auth does not throw for missing sessions; the
 * middleware owns this error. Rendered as 401 on HttpApi contracts.
 */
export class Unauthorized extends Schema.TaggedError<Unauthorized>('Unauthorized')(
  'Unauthorized',
  {},
  { httpApiStatus: 401 }
) {}
