import { type BetterAuthOptions } from 'better-auth';
import { Effect } from 'effect';
import type { Instance, ServiceResult } from './types.js';
/**
 * Primitive factory (SPEC §2): builds the raw better-auth instance as an
 * Effect. Consumers wanting full control define their own tag and wrap the
 * api with `effectApi` themselves.
 *
 * Accepts a plain options object or an effectful options builder whose
 * requirements flow into the returned Effect's `R` (SPEC §6).
 */
export declare function make<O extends BetterAuthOptions, E, R>(options: Effect.Effect<O, E, R>): Effect.Effect<Instance<O>, E, R>;
export declare function make<const O extends BetterAuthOptions>(options: O): Effect.Effect<Instance<O>>;
/**
 * Convenience factory (SPEC §2, the headline API): mints a context key and
 * a layer providing `{ api, instance }`. Multi-instance via distinct ids —
 * reusing an id makes the services collide in context (v4 gotcha).
 */
export declare function service<O extends BetterAuthOptions, E, R>(id: string, options: Effect.Effect<O, E, R>): ServiceResult<O, E, R>;
export declare function service<const O extends BetterAuthOptions>(id: string, options: O): ServiceResult<O>;
