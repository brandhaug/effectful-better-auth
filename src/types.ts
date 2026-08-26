import { type betterAuth, type BetterAuthOptions } from 'better-auth'
import { type Context, type Layer } from 'effect'
import { type EffectApi } from './effect-api.js'

/**
 * Named helper types (SPEC §2): consumers re-exporting a `service(...)`
 * result get these names in their declaration output instead of megabytes
 * of inlined structural types.
 */

/** The instance type Better Auth infers from a concrete options object. */
export type Instance<O extends BetterAuthOptions> = ReturnType<
  typeof betterAuth<O>
>

/**
 * The session as `getSession` actually returns it. Derived from the endpoint
 * rather than `$Infer.Session`: plugin schema fields (e.g. the admin
 * plugin's `user.role`) widen the endpoint's return type but do NOT reach
 * `$Infer.Session`, so the endpoint is the accurate source.
 */
export type Session<O extends BetterAuthOptions> = Instance<O>['api'] extends {
  getSession: (...args: never[]) => Promise<infer R>
}
  ? NonNullable<R>
  : Instance<O>['$Infer']['Session']

/** The effectful `api` surface of an instance built from options `O`. */
export type Api<O extends BetterAuthOptions> = EffectApi<Instance<O>['api']>

/** The service shape provided by the factory's layer. */
export type Service<O extends BetterAuthOptions> = {
  readonly api: Api<O>
  readonly instance: Instance<O>
}

/** The context key minted by `service(id, options)`. */
export type Tag<O extends BetterAuthOptions> = Context.Service<
  Service<O>,
  Service<O>
>

/** The `{ Tag, layer }` pair returned by `service(id, options)`. */
export type ServiceResult<O extends BetterAuthOptions, E = never, R = never> = {
  readonly Tag: Tag<O>
  readonly layer: Layer.Layer<Service<O>, E, R>
}
