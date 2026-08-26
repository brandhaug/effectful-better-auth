import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { Context, Effect, Layer } from 'effect'
import { effectApi } from './effect-api.js'
import {
  type Instance,
  type Service,
  type ServiceResult,
  type Tag
} from './types.js'

const resolveOptions = <O extends BetterAuthOptions, E, R>(
  options: O | Effect.Effect<O, E, R>
): Effect.Effect<O, E, R> => {
  if (Effect.isEffect(options)) return options
  return Effect.succeed(options)
}

/**
 * Primitive factory (SPEC §2): builds the raw better-auth instance as an
 * Effect. Consumers wanting full control define their own tag and wrap the
 * api with `effectApi` themselves.
 *
 * Accepts a plain options object or an effectful options builder whose
 * requirements flow into the returned Effect's `R` (SPEC §6).
 */
export function make<O extends BetterAuthOptions, E, R>(
  options: Effect.Effect<O, E, R>
): Effect.Effect<Instance<O>, E, R>
export function make<const O extends BetterAuthOptions>(
  options: O
): Effect.Effect<Instance<O>>
export function make<O extends BetterAuthOptions, E, R>(
  options: O | Effect.Effect<O, E, R>
): Effect.Effect<Instance<O>, E, R> {
  return Effect.map(resolveOptions(options), (o) => betterAuth(o))
}

const toService = <O extends BetterAuthOptions>(
  instance: Instance<O>
): Service<O> => ({
  api: effectApi(instance.api),
  instance
})

/**
 * Convenience factory (SPEC §2, the headline API): mints a context key and
 * a layer providing `{ api, instance }`. Multi-instance via distinct ids —
 * reusing an id makes the services collide in context (v4 gotcha).
 */
export function service<O extends BetterAuthOptions, E, R>(
  id: string,
  options: Effect.Effect<O, E, R>
): ServiceResult<O, E, R>
export function service<const O extends BetterAuthOptions>(
  id: string,
  options: O
): ServiceResult<O>
export function service<O extends BetterAuthOptions, E, R>(
  id: string,
  options: O | Effect.Effect<O, E, R>
): ServiceResult<O, E, R> {
  const TagKey: Tag<O> = Context.Service<Service<O>>(id)
  const layer = Layer.effect(TagKey)(
    Effect.map(make(resolveOptions(options)), toService)
  )
  return { Tag: TagKey, layer }
}
