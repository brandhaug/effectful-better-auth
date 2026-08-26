export { BetterAuthApiError, Unauthorized } from './errors.js'
export { CurrentHeaders } from './current-headers.js'
export { effectApi, type EffectApi } from './effect-api.js'
export { make, service } from './factory.js'
export { plugins } from './plugins.js'
export {
  type CurrentSessionErrors,
  type CurrentSessionFn,
  type CurrentSessionId,
  type CurrentSessionKey,
  type CurrentSessionOptionErrors,
  type CurrentSessionOptionFn,
  type CurrentSessionOptionId,
  type CurrentSessionOptionKey,
  sessionMiddleware,
  type SessionKey,
  type SessionMiddleware,
  type SessionMiddlewareOptions,
  type SessionOptionKey
} from './middleware.js'
export { route, toHttpEffect } from './mount.js'
export type { Api, Instance, Service, ServiceResult, Session, Tag } from './types.js'
