import type { BetterAuthOptions } from 'better-auth';
type PluginList = NonNullable<BetterAuthOptions['plugins']>;
/**
 * Preserves the plugins array as a tuple of each call's precise type.
 *
 * A bare array literal inside a function body (e.g. an effectful options
 * builder) widens to `(A | B | C)[]`, which silently drops Better Auth's
 * plugin schema inference — plugin-added user/session fields (like the
 * admin plugin's `user.role`) vanish from `getSession`'s return type while
 * the endpoints themselves keep working. Inline options at a call site
 * don't hit this; options built in a function do. Wrap the array:
 *
 * ```ts
 * plugins: plugins(username(), admin({ adminRoles: ['admin'] }))
 * ```
 */
export declare const plugins: <const T extends PluginList>(...items: T) => T;
export {};
