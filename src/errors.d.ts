import { Schema } from 'effect';
declare const BetterAuthApiError_base: Schema.Class<BetterAuthApiError, Schema.TaggedStruct<"BetterAuthApiError", {
    readonly statusCode: Schema.Number;
    readonly code: Schema.UndefinedOr<Schema.String>;
    readonly message: Schema.String;
    readonly headers: Schema.declare<HeadersInit, HeadersInit>;
}>, import("effect/Cause").YieldableError>;
/**
 * The single tagged error for failing `auth.api.*` calls (SPEC §3).
 *
 * Discriminate on `statusCode` or `code` — never on `message`, which is
 * human-readable text and may be localized.
 */
export declare class BetterAuthApiError extends BetterAuthApiError_base {
}
declare const Unauthorized_base: Schema.Class<Unauthorized, Schema.TaggedStruct<"Unauthorized", {}>, import("effect/Cause").YieldableError>;
/**
 * Failure of the required session middleware when `getSession` resolves
 * `null` (SPEC §5). Better Auth does not throw for missing sessions; the
 * middleware owns this error. Rendered as 401 on HttpApi contracts.
 */
export declare class Unauthorized extends Unauthorized_base {
}
export {};
