/**
 * THROWAWAY PROTOTYPE — wayfinder ticket #6.
 *
 * Question: can a factory return a tag/layer/call-helper that preserves the
 * consumer's plugin-inferred `typeof betterAuth(options)` — so that
 * `auth.api.listUsers` (admin plugin) and `auth.api.signInUsername`
 * (username plugin) typecheck through the service, and are ABSENT without
 * the plugins?
 *
 * Verdict comes from `bun run typecheck`: the positive assertions must
 * compile, the `@ts-expect-error` negative assertions must stay errors.
 * `bun run declaration` probes the TS4023 re-export risk (see reexport.ts).
 */
import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { Context, Effect, Layer, Schema } from 'effect';
declare const BetterAuthApiError_base: Schema.Class<BetterAuthApiError, Schema.TaggedStruct<"BetterAuthApiError", {
    readonly status: Schema.Union<readonly [Schema.String, Schema.Number]>;
    readonly message: Schema.String;
}>, import("effect/Cause").YieldableError>;
export declare class BetterAuthApiError extends BetterAuthApiError_base {
}
type InstanceOf<O extends BetterAuthOptions> = ReturnType<typeof betterAuth<O>>;
export declare const make: <const O extends BetterAuthOptions>(options: O) => Effect.Effect<InstanceOf<O>>;
declare const AuthA_base: Context.ServiceClass<AuthA, "proto/AuthA", import("better-auth").Auth<{
    secret: string;
    baseURL: string;
    emailAndPassword: {
        enabled: true;
    };
    plugins: [{
        id: "username";
        version: string;
        init(ctx: import("better-auth").AuthContext): {
            options: {
                databaseHooks: {
                    user: {
                        create: {
                            before(user: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image?: string | null | undefined;
                            } & Record<string, unknown>, context: import("better-auth").GenericEndpointContext | null): Promise<{
                                data: {
                                    username: string;
                                    displayUsername: string;
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    image?: string | null | undefined;
                                };
                            } | {
                                data: {
                                    displayUsername?: string | undefined;
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    image?: string | null | undefined;
                                };
                            }>;
                        };
                        update: {
                            before(user: Partial<{
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image?: string | null | undefined;
                            }> & Record<string, unknown>, context: import("better-auth").GenericEndpointContext | null): Promise<{
                                data: {
                                    displayUsername?: string | undefined;
                                    username: string;
                                    id?: string | undefined;
                                    createdAt?: Date | undefined;
                                    updatedAt?: Date | undefined;
                                    email?: string | undefined;
                                    emailVerified?: boolean | undefined;
                                    name?: string | undefined;
                                    image?: string | null | undefined;
                                };
                            } | {
                                data: {
                                    displayUsername?: string | undefined;
                                    id?: string | undefined;
                                    createdAt?: Date | undefined;
                                    updatedAt?: Date | undefined;
                                    email?: string | undefined;
                                    emailVerified?: boolean | undefined;
                                    name?: string | undefined;
                                    image?: string | null | undefined;
                                };
                            }>;
                        };
                    };
                };
            };
        };
        endpoints: {
            signInUsername: import("better-call").StrictEndpoint<"/sign-in/username", {
                method: "POST";
                body: import("zod").ZodObject<{
                    username: import("zod").ZodString;
                    password: import("zod").ZodString;
                    rememberMe: import("zod").ZodOptional<import("zod").ZodBoolean>;
                    callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("zod/v4/core").$strip>;
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                redirect: {
                                                    type: string;
                                                    description: string;
                                                };
                                                token: {
                                                    type: string;
                                                    description: string;
                                                };
                                                url: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                            422: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                message: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                redirect: boolean;
                token: string;
                url: string | undefined;
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                } & {
                    username: string;
                    displayUsername: string;
                };
            }>;
            isUsernameAvailable: import("better-call").StrictEndpoint<"/is-username-available", {
                method: "POST";
                body: import("zod").ZodObject<{
                    username: import("zod").ZodString;
                }, import("zod/v4/core").$strip>;
            }, {
                available: boolean;
            }>;
        };
        schema: {
            user: {
                fields: {
                    username: {
                        type: "string";
                        required: false;
                        sortable: true;
                        unique: true;
                        returned: true;
                        transform: {
                            input(value: import("better-auth").DBPrimitive): string | number | boolean | Date | Record<string, unknown> | unknown[] | null | undefined;
                        };
                    };
                    displayUsername: {
                        type: "string";
                        required: false;
                        transform: {
                            input(value: import("better-auth").DBPrimitive): string | number | boolean | Date | Record<string, unknown> | unknown[] | null | undefined;
                        };
                    };
                };
            };
        };
        hooks: {
            before: {
                matcher(context: import("better-auth").HookEndpointContext): boolean;
                handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
            }[];
        };
        options: import("better-auth/plugins/username").UsernameOptions | undefined;
        $ERROR_CODES: {
            EMAIL_NOT_VERIFIED: import("better-auth").RawError<"EMAIL_NOT_VERIFIED">;
            UNEXPECTED_ERROR: import("better-auth").RawError<"UNEXPECTED_ERROR">;
            INVALID_USERNAME_OR_PASSWORD: import("better-auth").RawError<"INVALID_USERNAME_OR_PASSWORD">;
            USERNAME_IS_ALREADY_TAKEN: import("better-auth").RawError<"USERNAME_IS_ALREADY_TAKEN">;
            USERNAME_TOO_SHORT: import("better-auth").RawError<"USERNAME_TOO_SHORT">;
            USERNAME_TOO_LONG: import("better-auth").RawError<"USERNAME_TOO_LONG">;
            INVALID_USERNAME: import("better-auth").RawError<"INVALID_USERNAME">;
            INVALID_DISPLAY_USERNAME: import("better-auth").RawError<"INVALID_DISPLAY_USERNAME">;
        };
    }, {
        id: "admin";
        version: string;
        init(): {
            options: {
                databaseHooks: {
                    user: {
                        create: {
                            before(user: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image?: string | null | undefined;
                            } & Record<string, unknown>): Promise<{
                                data: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    image?: string | null | undefined;
                                    role: string;
                                };
                            }>;
                        };
                    };
                    session: {
                        create: {
                            before(session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            } & Record<string, unknown>, ctx: import("better-auth").GenericEndpointContext | null): Promise<void>;
                        };
                    };
                };
            };
        };
        hooks: {
            after: {
                matcher(context: import("better-auth").HookEndpointContext): boolean;
                handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<import("better-auth/plugins/admin").SessionWithImpersonatedBy[] | undefined>;
            }[];
        };
        endpoints: {
            setRole: import("better-call").StrictEndpoint<"/admin/set-role", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                    role: import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>]>;
                }, import("zod/v4/core").$strip>;
                requireHeaders: true;
                use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins/admin").UserWithRole;
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: {
                            userId: string;
                            role: "admin" | "user" | ("admin" | "user")[];
                        };
                    };
                };
            }, {
                user: import("better-auth/plugins/admin").UserWithRole;
            }>;
            getUser: import("better-call").StrictEndpoint<"/admin/get-user", {
                method: "GET";
                query: import("zod").ZodObject<{
                    id: import("zod").ZodString;
                }, import("zod/v4/core").$strip>;
                use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins/admin").UserWithRole;
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, import("better-auth/plugins/admin").UserWithRole>;
            createUser: import("better-call").StrictEndpoint<"/admin/create-user", {
                method: "POST";
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    password: import("zod").ZodOptional<import("zod").ZodString>;
                    name: import("zod").ZodString;
                    role: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>]>>;
                    data: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
                }, import("zod/v4/core").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: {
                            email: string;
                            password?: string | undefined;
                            name: string;
                            role?: "admin" | "user" | ("admin" | "user")[] | undefined;
                            data?: Record<string, any> | undefined;
                        };
                    };
                };
            }, {
                user: import("better-auth/plugins/admin").UserWithRole;
            }>;
            adminUpdateUser: import("better-call").StrictEndpoint<"/admin/update-user", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                    data: import("zod").ZodRecord<import("zod").ZodAny, import("zod").ZodAny>;
                }, import("zod/v4/core").$strip>;
                use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins/admin").UserWithRole;
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, import("better-auth/plugins/admin").UserWithRole>;
            listUsers: import("better-call").StrictEndpoint<"/admin/list-users", {
                method: "GET";
                use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins/admin").UserWithRole;
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                    };
                }>)[];
                query: import("zod").ZodObject<{
                    searchValue: import("zod").ZodOptional<import("zod").ZodString>;
                    searchField: import("zod").ZodOptional<import("zod").ZodEnum<{
                        email: "email";
                        name: "name";
                    }>>;
                    searchOperator: import("zod").ZodOptional<import("zod").ZodEnum<{
                        contains: "contains";
                        starts_with: "starts_with";
                        ends_with: "ends_with";
                    }>>;
                    limit: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
                    offset: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
                    sortBy: import("zod").ZodOptional<import("zod").ZodString>;
                    sortDirection: import("zod").ZodOptional<import("zod").ZodEnum<{
                        asc: "asc";
                        desc: "desc";
                    }>>;
                    filterField: import("zod").ZodOptional<import("zod").ZodString>;
                    filterValue: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>, import("zod").ZodBoolean]>, import("zod").ZodArray<import("zod").ZodString>]>, import("zod").ZodArray<import("zod").ZodNumber>]>>;
                    filterOperator: import("zod").ZodOptional<import("zod").ZodEnum<{
                        eq: "eq";
                        ne: "ne";
                        gt: "gt";
                        gte: "gte";
                        lt: "lt";
                        lte: "lte";
                        in: "in";
                        not_in: "not_in";
                        contains: "contains";
                        starts_with: "starts_with";
                        ends_with: "ends_with";
                    }>>;
                }, import("zod/v4/core").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                users: {
                                                    type: string;
                                                    items: {
                                                        $ref: string;
                                                    };
                                                };
                                                total: {
                                                    type: string;
                                                };
                                                limit: {
                                                    type: string;
                                                };
                                                offset: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                users: import("better-auth/plugins/admin").UserWithRole[];
                total: number;
            }>;
            listUserSessions: import("better-call").StrictEndpoint<"/admin/list-user-sessions", {
                method: "POST";
                use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins/admin").UserWithRole;
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                    };
                }>)[];
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                }, import("zod/v4/core").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                sessions: {
                                                    type: string;
                                                    items: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                sessions: import("better-auth/plugins/admin").SessionWithImpersonatedBy[];
            }>;
            unbanUser: import("better-call").StrictEndpoint<"/admin/unban-user", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                }, import("zod/v4/core").$strip>;
                use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins/admin").UserWithRole;
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                user: import("better-auth/plugins/admin").UserWithRole;
            }>;
            banUser: import("better-call").StrictEndpoint<"/admin/ban-user", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                    banReason: import("zod").ZodOptional<import("zod").ZodString>;
                    banExpiresIn: import("zod").ZodOptional<import("zod").ZodNumber>;
                }, import("zod/v4/core").$strip>;
                use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins/admin").UserWithRole;
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                user: import("better-auth/plugins/admin").UserWithRole;
            }>;
            impersonateUser: import("better-call").StrictEndpoint<"/admin/impersonate-user", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                }, import("zod/v4/core").$strip>;
                use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins/admin").UserWithRole;
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                session: {
                                                    $ref: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                session: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined;
                    userAgent?: string | null | undefined;
                };
                user: import("better-auth/plugins/admin").UserWithRole;
            }>;
            stopImpersonating: import("better-call").StrictEndpoint<"/admin/stop-impersonating", {
                method: "POST";
                requireHeaders: true;
            }, {
                session: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined;
                    userAgent?: string | null | undefined;
                } & Record<string, any>;
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                } & Record<string, any>;
            }>;
            revokeUserSession: import("better-call").StrictEndpoint<"/admin/revoke-user-session", {
                method: "POST";
                body: import("zod").ZodObject<{
                    sessionToken: import("zod").ZodString;
                }, import("zod/v4/core").$strip>;
                use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins/admin").UserWithRole;
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                success: boolean;
            }>;
            revokeUserSessions: import("better-call").StrictEndpoint<"/admin/revoke-user-sessions", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                }, import("zod/v4/core").$strip>;
                use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins/admin").UserWithRole;
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                success: boolean;
            }>;
            removeUser: import("better-call").StrictEndpoint<"/admin/remove-user", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                }, import("zod/v4/core").$strip>;
                use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins/admin").UserWithRole;
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                success: boolean;
            }>;
            setUserPassword: import("better-call").StrictEndpoint<"/admin/set-user-password", {
                method: "POST";
                body: import("zod").ZodObject<{
                    newPassword: import("zod").ZodString;
                    userId: import("zod").ZodCoercedString<unknown>;
                }, import("zod/v4/core").$strip>;
                use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins/admin").UserWithRole;
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                status: boolean;
            }>;
            userHasPermission: import("better-call").StrictEndpoint<"/admin/has-permission", {
                method: "POST";
                body: import("zod").ZodIntersection<import("zod").ZodObject<{
                    userId: import("zod").ZodOptional<import("zod").ZodCoercedString<unknown>>;
                    role: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("zod/v4/core").$strip>, import("zod").ZodXor<readonly [import("zod").ZodObject<{
                    permission: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>>;
                }, import("zod/v4/core").$strip>, import("zod").ZodObject<{
                    permissions: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>>;
                }, import("zod/v4/core").$strip>]>>;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            permissions: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                error: {
                                                    type: string;
                                                };
                                                success: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: {
                            permissions: {
                                readonly user?: ("set-role" | "create" | "list" | "ban" | "impersonate" | "impersonate-admins" | "delete" | "set-password" | "set-email" | "get" | "update")[] | undefined;
                                readonly session?: ("list" | "delete" | "revoke")[] | undefined;
                            };
                        } & {
                            userId?: string | undefined;
                            role?: "admin" | "user" | undefined;
                        };
                    };
                };
            }, {
                error: null;
                success: boolean;
            }>;
        };
        $ERROR_CODES: {
            USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: import("better-auth").RawError<"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL">;
            FAILED_TO_CREATE_USER: import("better-auth").RawError<"FAILED_TO_CREATE_USER">;
            USER_ALREADY_EXISTS: import("better-auth").RawError<"USER_ALREADY_EXISTS">;
            YOU_CANNOT_BAN_YOURSELF: import("better-auth").RawError<"YOU_CANNOT_BAN_YOURSELF">;
            YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE">;
            YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS">;
            YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS">;
            YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS">;
            YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_BAN_USERS">;
            YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS">;
            YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS">;
            YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS">;
            YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD">;
            BANNED_USER: import("better-auth").RawError<"BANNED_USER">;
            YOU_ARE_NOT_ALLOWED_TO_GET_USER: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_USER">;
            NO_DATA_TO_UPDATE: import("better-auth").RawError<"NO_DATA_TO_UPDATE">;
            YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS">;
            YOU_CANNOT_REMOVE_YOURSELF: import("better-auth").RawError<"YOU_CANNOT_REMOVE_YOURSELF">;
            YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE">;
            YOU_CANNOT_IMPERSONATE_ADMINS: import("better-auth").RawError<"YOU_CANNOT_IMPERSONATE_ADMINS">;
            INVALID_ROLE_TYPE: import("better-auth").RawError<"INVALID_ROLE_TYPE">;
            YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL">;
            PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER: import("better-auth").RawError<"PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER">;
        };
        schema: {
            user: {
                fields: {
                    role: {
                        type: "string";
                        required: false;
                        input: false;
                    };
                    banned: {
                        type: "boolean";
                        defaultValue: false;
                        required: false;
                        input: false;
                    };
                    banReason: {
                        type: "string";
                        required: false;
                        input: false;
                    };
                    banExpires: {
                        type: "date";
                        required: false;
                        input: false;
                    };
                };
            };
            session: {
                fields: {
                    impersonatedBy: {
                        type: "string";
                        required: false;
                        input: false;
                    };
                };
            };
        };
        options: NoInfer<{
            adminRoles: string[];
        }>;
    }];
}>>;
declare class AuthA extends AuthA_base {
}
export declare const service: <const O extends BetterAuthOptions>(id: string, options: O) => {
    readonly Tag: Context.Service<import("better-auth").Auth<O>, import("better-auth").Auth<O>>;
    readonly layer: Layer.Layer<import("better-auth").Auth<O>, never, never>;
    readonly call: <A>(f: (api: InstanceOf<O>["api"]) => Promise<A>) => Effect.Effect<A, BetterAuthApiError, import("better-auth").Auth<O>>;
};
export declare const exports_: {
    a1: Effect.Effect<import("better-auth/plugins/admin").UserWithRole[], never, AuthA>;
    a2: Effect.Effect<{
        redirect: boolean;
        token: string;
        url: string | undefined;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
        } & {
            username: string;
            displayUsername: string;
        };
    }, never, AuthA>;
    b1: Effect.Effect<{
        users: import("better-auth/plugins/admin").UserWithRole[];
        total: number;
    }, BetterAuthApiError, import("better-auth").Auth<{
        readonly secret: "proto-secret";
        readonly baseURL: "http://localhost:9999";
        readonly emailAndPassword: {
            readonly enabled: true;
        };
        readonly plugins: [{
            id: "username";
            version: string;
            init(ctx: import("better-auth").AuthContext): {
                options: {
                    databaseHooks: {
                        user: {
                            create: {
                                before(user: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    image?: string | null | undefined;
                                } & Record<string, unknown>, context: import("better-auth").GenericEndpointContext | null): Promise<{
                                    data: {
                                        username: string;
                                        displayUsername: string;
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image?: string | null | undefined;
                                    };
                                } | {
                                    data: {
                                        displayUsername?: string | undefined;
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image?: string | null | undefined;
                                    };
                                }>;
                            };
                            update: {
                                before(user: Partial<{
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    image?: string | null | undefined;
                                }> & Record<string, unknown>, context: import("better-auth").GenericEndpointContext | null): Promise<{
                                    data: {
                                        displayUsername?: string | undefined;
                                        username: string;
                                        id?: string | undefined;
                                        createdAt?: Date | undefined;
                                        updatedAt?: Date | undefined;
                                        email?: string | undefined;
                                        emailVerified?: boolean | undefined;
                                        name?: string | undefined;
                                        image?: string | null | undefined;
                                    };
                                } | {
                                    data: {
                                        displayUsername?: string | undefined;
                                        id?: string | undefined;
                                        createdAt?: Date | undefined;
                                        updatedAt?: Date | undefined;
                                        email?: string | undefined;
                                        emailVerified?: boolean | undefined;
                                        name?: string | undefined;
                                        image?: string | null | undefined;
                                    };
                                }>;
                            };
                        };
                    };
                };
            };
            endpoints: {
                signInUsername: import("better-call").StrictEndpoint<"/sign-in/username", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        username: import("zod").ZodString;
                        password: import("zod").ZodString;
                        rememberMe: import("zod").ZodOptional<import("zod").ZodBoolean>;
                        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod/v4/core").$strip>;
                    metadata: {
                        openapi: {
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    redirect: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    token: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    url: {
                                                        type: string;
                                                        nullable: boolean;
                                                        description: string;
                                                    };
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                    };
                                };
                                422: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    message: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    redirect: boolean;
                    token: string;
                    url: string | undefined;
                    user: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    } & {
                        username: string;
                        displayUsername: string;
                    };
                }>;
                isUsernameAvailable: import("better-call").StrictEndpoint<"/is-username-available", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        username: import("zod").ZodString;
                    }, import("zod/v4/core").$strip>;
                }, {
                    available: boolean;
                }>;
            };
            schema: {
                user: {
                    fields: {
                        username: {
                            type: "string";
                            required: false;
                            sortable: true;
                            unique: true;
                            returned: true;
                            transform: {
                                input(value: import("better-auth").DBPrimitive): string | number | boolean | Date | Record<string, unknown> | unknown[] | null | undefined;
                            };
                        };
                        displayUsername: {
                            type: "string";
                            required: false;
                            transform: {
                                input(value: import("better-auth").DBPrimitive): string | number | boolean | Date | Record<string, unknown> | unknown[] | null | undefined;
                            };
                        };
                    };
                };
            };
            hooks: {
                before: {
                    matcher(context: import("better-auth").HookEndpointContext): boolean;
                    handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
                }[];
            };
            options: import("better-auth/plugins/username").UsernameOptions | undefined;
            $ERROR_CODES: {
                EMAIL_NOT_VERIFIED: import("better-auth").RawError<"EMAIL_NOT_VERIFIED">;
                UNEXPECTED_ERROR: import("better-auth").RawError<"UNEXPECTED_ERROR">;
                INVALID_USERNAME_OR_PASSWORD: import("better-auth").RawError<"INVALID_USERNAME_OR_PASSWORD">;
                USERNAME_IS_ALREADY_TAKEN: import("better-auth").RawError<"USERNAME_IS_ALREADY_TAKEN">;
                USERNAME_TOO_SHORT: import("better-auth").RawError<"USERNAME_TOO_SHORT">;
                USERNAME_TOO_LONG: import("better-auth").RawError<"USERNAME_TOO_LONG">;
                INVALID_USERNAME: import("better-auth").RawError<"INVALID_USERNAME">;
                INVALID_DISPLAY_USERNAME: import("better-auth").RawError<"INVALID_DISPLAY_USERNAME">;
            };
        }, {
            id: "admin";
            version: string;
            init(): {
                options: {
                    databaseHooks: {
                        user: {
                            create: {
                                before(user: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    image?: string | null | undefined;
                                } & Record<string, unknown>): Promise<{
                                    data: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image?: string | null | undefined;
                                        role: string;
                                    };
                                }>;
                            };
                        };
                        session: {
                            create: {
                                before(session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                } & Record<string, unknown>, ctx: import("better-auth").GenericEndpointContext | null): Promise<void>;
                            };
                        };
                    };
                };
            };
            hooks: {
                after: {
                    matcher(context: import("better-auth").HookEndpointContext): boolean;
                    handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<import("better-auth/plugins/admin").SessionWithImpersonatedBy[] | undefined>;
                }[];
            };
            endpoints: {
                setRole: import("better-call").StrictEndpoint<"/admin/set-role", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                        role: import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>]>;
                    }, import("zod/v4/core").$strip>;
                    requireHeaders: true;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        $Infer: {
                            body: {
                                userId: string;
                                role: "admin" | "user" | ("admin" | "user")[];
                            };
                        };
                    };
                }, {
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                getUser: import("better-call").StrictEndpoint<"/admin/get-user", {
                    method: "GET";
                    query: import("zod").ZodObject<{
                        id: import("zod").ZodString;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, import("better-auth/plugins/admin").UserWithRole>;
                createUser: import("better-call").StrictEndpoint<"/admin/create-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        email: import("zod").ZodString;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                        name: import("zod").ZodString;
                        role: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>]>>;
                        data: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
                    }, import("zod/v4/core").$strip>;
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        $Infer: {
                            body: {
                                email: string;
                                password?: string | undefined;
                                name: string;
                                role?: "admin" | "user" | ("admin" | "user")[] | undefined;
                                data?: Record<string, any> | undefined;
                            };
                        };
                    };
                }, {
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                adminUpdateUser: import("better-call").StrictEndpoint<"/admin/update-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                        data: import("zod").ZodRecord<import("zod").ZodAny, import("zod").ZodAny>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, import("better-auth/plugins/admin").UserWithRole>;
                listUsers: import("better-call").StrictEndpoint<"/admin/list-users", {
                    method: "GET";
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    query: import("zod").ZodObject<{
                        searchValue: import("zod").ZodOptional<import("zod").ZodString>;
                        searchField: import("zod").ZodOptional<import("zod").ZodEnum<{
                            email: "email";
                            name: "name";
                        }>>;
                        searchOperator: import("zod").ZodOptional<import("zod").ZodEnum<{
                            contains: "contains";
                            starts_with: "starts_with";
                            ends_with: "ends_with";
                        }>>;
                        limit: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
                        offset: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
                        sortBy: import("zod").ZodOptional<import("zod").ZodString>;
                        sortDirection: import("zod").ZodOptional<import("zod").ZodEnum<{
                            asc: "asc";
                            desc: "desc";
                        }>>;
                        filterField: import("zod").ZodOptional<import("zod").ZodString>;
                        filterValue: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>, import("zod").ZodBoolean]>, import("zod").ZodArray<import("zod").ZodString>]>, import("zod").ZodArray<import("zod").ZodNumber>]>>;
                        filterOperator: import("zod").ZodOptional<import("zod").ZodEnum<{
                            eq: "eq";
                            ne: "ne";
                            gt: "gt";
                            gte: "gte";
                            lt: "lt";
                            lte: "lte";
                            in: "in";
                            not_in: "not_in";
                            contains: "contains";
                            starts_with: "starts_with";
                            ends_with: "ends_with";
                        }>>;
                    }, import("zod/v4/core").$strip>;
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    users: {
                                                        type: string;
                                                        items: {
                                                            $ref: string;
                                                        };
                                                    };
                                                    total: {
                                                        type: string;
                                                    };
                                                    limit: {
                                                        type: string;
                                                    };
                                                    offset: {
                                                        type: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    users: import("better-auth/plugins/admin").UserWithRole[];
                    total: number;
                }>;
                listUserSessions: import("better-call").StrictEndpoint<"/admin/list-user-sessions", {
                    method: "POST";
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    sessions: {
                                                        type: string;
                                                        items: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    sessions: import("better-auth/plugins/admin").SessionWithImpersonatedBy[];
                }>;
                unbanUser: import("better-call").StrictEndpoint<"/admin/unban-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                banUser: import("better-call").StrictEndpoint<"/admin/ban-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                        banReason: import("zod").ZodOptional<import("zod").ZodString>;
                        banExpiresIn: import("zod").ZodOptional<import("zod").ZodNumber>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                impersonateUser: import("better-call").StrictEndpoint<"/admin/impersonate-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    session: {
                                                        $ref: string;
                                                    };
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    session: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                stopImpersonating: import("better-call").StrictEndpoint<"/admin/stop-impersonating", {
                    method: "POST";
                    requireHeaders: true;
                }, {
                    session: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    } & Record<string, any>;
                    user: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    } & Record<string, any>;
                }>;
                revokeUserSession: import("better-call").StrictEndpoint<"/admin/revoke-user-session", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        sessionToken: import("zod").ZodString;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    success: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    success: boolean;
                }>;
                revokeUserSessions: import("better-call").StrictEndpoint<"/admin/revoke-user-sessions", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    success: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    success: boolean;
                }>;
                removeUser: import("better-call").StrictEndpoint<"/admin/remove-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    success: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    success: boolean;
                }>;
                setUserPassword: import("better-call").StrictEndpoint<"/admin/set-user-password", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        newPassword: import("zod").ZodString;
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    status: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    status: boolean;
                }>;
                userHasPermission: import("better-call").StrictEndpoint<"/admin/has-permission", {
                    method: "POST";
                    body: import("zod").ZodIntersection<import("zod").ZodObject<{
                        userId: import("zod").ZodOptional<import("zod").ZodCoercedString<unknown>>;
                        role: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod/v4/core").$strip>, import("zod").ZodXor<readonly [import("zod").ZodObject<{
                        permission: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>>;
                    }, import("zod/v4/core").$strip>, import("zod").ZodObject<{
                        permissions: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>>;
                    }, import("zod/v4/core").$strip>]>>;
                    metadata: {
                        openapi: {
                            description: string;
                            requestBody: {
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                permissions: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                            responses: {
                                "200": {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    error: {
                                                        type: string;
                                                    };
                                                    success: {
                                                        type: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        $Infer: {
                            body: {
                                permissions: {
                                    readonly user?: ("set-role" | "create" | "list" | "ban" | "impersonate" | "impersonate-admins" | "delete" | "set-password" | "set-email" | "get" | "update")[] | undefined;
                                    readonly session?: ("list" | "delete" | "revoke")[] | undefined;
                                };
                            } & {
                                userId?: string | undefined;
                                role?: "admin" | "user" | undefined;
                            };
                        };
                    };
                }, {
                    error: null;
                    success: boolean;
                }>;
            };
            $ERROR_CODES: {
                USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: import("better-auth").RawError<"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL">;
                FAILED_TO_CREATE_USER: import("better-auth").RawError<"FAILED_TO_CREATE_USER">;
                USER_ALREADY_EXISTS: import("better-auth").RawError<"USER_ALREADY_EXISTS">;
                YOU_CANNOT_BAN_YOURSELF: import("better-auth").RawError<"YOU_CANNOT_BAN_YOURSELF">;
                YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE">;
                YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS">;
                YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_BAN_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS">;
                YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD">;
                BANNED_USER: import("better-auth").RawError<"BANNED_USER">;
                YOU_ARE_NOT_ALLOWED_TO_GET_USER: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_USER">;
                NO_DATA_TO_UPDATE: import("better-auth").RawError<"NO_DATA_TO_UPDATE">;
                YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS">;
                YOU_CANNOT_REMOVE_YOURSELF: import("better-auth").RawError<"YOU_CANNOT_REMOVE_YOURSELF">;
                YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE">;
                YOU_CANNOT_IMPERSONATE_ADMINS: import("better-auth").RawError<"YOU_CANNOT_IMPERSONATE_ADMINS">;
                INVALID_ROLE_TYPE: import("better-auth").RawError<"INVALID_ROLE_TYPE">;
                YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL">;
                PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER: import("better-auth").RawError<"PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER">;
            };
            schema: {
                user: {
                    fields: {
                        role: {
                            type: "string";
                            required: false;
                            input: false;
                        };
                        banned: {
                            type: "boolean";
                            defaultValue: false;
                            required: false;
                            input: false;
                        };
                        banReason: {
                            type: "string";
                            required: false;
                            input: false;
                        };
                        banExpires: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                    };
                };
                session: {
                    fields: {
                        impersonatedBy: {
                            type: "string";
                            required: false;
                            input: false;
                        };
                    };
                };
            };
            options: NoInfer<{
                adminRoles: string[];
            }>;
        }];
    }>>;
    b2: Effect.Effect<{
        redirect: boolean;
        token: string;
        url: string | undefined;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
        } & {
            username: string;
            displayUsername: string;
        };
    }, BetterAuthApiError, import("better-auth").Auth<{
        readonly secret: "proto-secret";
        readonly baseURL: "http://localhost:9999";
        readonly emailAndPassword: {
            readonly enabled: true;
        };
        readonly plugins: [{
            id: "username";
            version: string;
            init(ctx: import("better-auth").AuthContext): {
                options: {
                    databaseHooks: {
                        user: {
                            create: {
                                before(user: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    image?: string | null | undefined;
                                } & Record<string, unknown>, context: import("better-auth").GenericEndpointContext | null): Promise<{
                                    data: {
                                        username: string;
                                        displayUsername: string;
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image?: string | null | undefined;
                                    };
                                } | {
                                    data: {
                                        displayUsername?: string | undefined;
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image?: string | null | undefined;
                                    };
                                }>;
                            };
                            update: {
                                before(user: Partial<{
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    image?: string | null | undefined;
                                }> & Record<string, unknown>, context: import("better-auth").GenericEndpointContext | null): Promise<{
                                    data: {
                                        displayUsername?: string | undefined;
                                        username: string;
                                        id?: string | undefined;
                                        createdAt?: Date | undefined;
                                        updatedAt?: Date | undefined;
                                        email?: string | undefined;
                                        emailVerified?: boolean | undefined;
                                        name?: string | undefined;
                                        image?: string | null | undefined;
                                    };
                                } | {
                                    data: {
                                        displayUsername?: string | undefined;
                                        id?: string | undefined;
                                        createdAt?: Date | undefined;
                                        updatedAt?: Date | undefined;
                                        email?: string | undefined;
                                        emailVerified?: boolean | undefined;
                                        name?: string | undefined;
                                        image?: string | null | undefined;
                                    };
                                }>;
                            };
                        };
                    };
                };
            };
            endpoints: {
                signInUsername: import("better-call").StrictEndpoint<"/sign-in/username", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        username: import("zod").ZodString;
                        password: import("zod").ZodString;
                        rememberMe: import("zod").ZodOptional<import("zod").ZodBoolean>;
                        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod/v4/core").$strip>;
                    metadata: {
                        openapi: {
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    redirect: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    token: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    url: {
                                                        type: string;
                                                        nullable: boolean;
                                                        description: string;
                                                    };
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                    };
                                };
                                422: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    message: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    redirect: boolean;
                    token: string;
                    url: string | undefined;
                    user: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    } & {
                        username: string;
                        displayUsername: string;
                    };
                }>;
                isUsernameAvailable: import("better-call").StrictEndpoint<"/is-username-available", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        username: import("zod").ZodString;
                    }, import("zod/v4/core").$strip>;
                }, {
                    available: boolean;
                }>;
            };
            schema: {
                user: {
                    fields: {
                        username: {
                            type: "string";
                            required: false;
                            sortable: true;
                            unique: true;
                            returned: true;
                            transform: {
                                input(value: import("better-auth").DBPrimitive): string | number | boolean | Date | Record<string, unknown> | unknown[] | null | undefined;
                            };
                        };
                        displayUsername: {
                            type: "string";
                            required: false;
                            transform: {
                                input(value: import("better-auth").DBPrimitive): string | number | boolean | Date | Record<string, unknown> | unknown[] | null | undefined;
                            };
                        };
                    };
                };
            };
            hooks: {
                before: {
                    matcher(context: import("better-auth").HookEndpointContext): boolean;
                    handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
                }[];
            };
            options: import("better-auth/plugins/username").UsernameOptions | undefined;
            $ERROR_CODES: {
                EMAIL_NOT_VERIFIED: import("better-auth").RawError<"EMAIL_NOT_VERIFIED">;
                UNEXPECTED_ERROR: import("better-auth").RawError<"UNEXPECTED_ERROR">;
                INVALID_USERNAME_OR_PASSWORD: import("better-auth").RawError<"INVALID_USERNAME_OR_PASSWORD">;
                USERNAME_IS_ALREADY_TAKEN: import("better-auth").RawError<"USERNAME_IS_ALREADY_TAKEN">;
                USERNAME_TOO_SHORT: import("better-auth").RawError<"USERNAME_TOO_SHORT">;
                USERNAME_TOO_LONG: import("better-auth").RawError<"USERNAME_TOO_LONG">;
                INVALID_USERNAME: import("better-auth").RawError<"INVALID_USERNAME">;
                INVALID_DISPLAY_USERNAME: import("better-auth").RawError<"INVALID_DISPLAY_USERNAME">;
            };
        }, {
            id: "admin";
            version: string;
            init(): {
                options: {
                    databaseHooks: {
                        user: {
                            create: {
                                before(user: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    image?: string | null | undefined;
                                } & Record<string, unknown>): Promise<{
                                    data: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image?: string | null | undefined;
                                        role: string;
                                    };
                                }>;
                            };
                        };
                        session: {
                            create: {
                                before(session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                } & Record<string, unknown>, ctx: import("better-auth").GenericEndpointContext | null): Promise<void>;
                            };
                        };
                    };
                };
            };
            hooks: {
                after: {
                    matcher(context: import("better-auth").HookEndpointContext): boolean;
                    handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<import("better-auth/plugins/admin").SessionWithImpersonatedBy[] | undefined>;
                }[];
            };
            endpoints: {
                setRole: import("better-call").StrictEndpoint<"/admin/set-role", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                        role: import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>]>;
                    }, import("zod/v4/core").$strip>;
                    requireHeaders: true;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        $Infer: {
                            body: {
                                userId: string;
                                role: "admin" | "user" | ("admin" | "user")[];
                            };
                        };
                    };
                }, {
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                getUser: import("better-call").StrictEndpoint<"/admin/get-user", {
                    method: "GET";
                    query: import("zod").ZodObject<{
                        id: import("zod").ZodString;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, import("better-auth/plugins/admin").UserWithRole>;
                createUser: import("better-call").StrictEndpoint<"/admin/create-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        email: import("zod").ZodString;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                        name: import("zod").ZodString;
                        role: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>]>>;
                        data: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
                    }, import("zod/v4/core").$strip>;
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        $Infer: {
                            body: {
                                email: string;
                                password?: string | undefined;
                                name: string;
                                role?: "admin" | "user" | ("admin" | "user")[] | undefined;
                                data?: Record<string, any> | undefined;
                            };
                        };
                    };
                }, {
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                adminUpdateUser: import("better-call").StrictEndpoint<"/admin/update-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                        data: import("zod").ZodRecord<import("zod").ZodAny, import("zod").ZodAny>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, import("better-auth/plugins/admin").UserWithRole>;
                listUsers: import("better-call").StrictEndpoint<"/admin/list-users", {
                    method: "GET";
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    query: import("zod").ZodObject<{
                        searchValue: import("zod").ZodOptional<import("zod").ZodString>;
                        searchField: import("zod").ZodOptional<import("zod").ZodEnum<{
                            email: "email";
                            name: "name";
                        }>>;
                        searchOperator: import("zod").ZodOptional<import("zod").ZodEnum<{
                            contains: "contains";
                            starts_with: "starts_with";
                            ends_with: "ends_with";
                        }>>;
                        limit: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
                        offset: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
                        sortBy: import("zod").ZodOptional<import("zod").ZodString>;
                        sortDirection: import("zod").ZodOptional<import("zod").ZodEnum<{
                            asc: "asc";
                            desc: "desc";
                        }>>;
                        filterField: import("zod").ZodOptional<import("zod").ZodString>;
                        filterValue: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>, import("zod").ZodBoolean]>, import("zod").ZodArray<import("zod").ZodString>]>, import("zod").ZodArray<import("zod").ZodNumber>]>>;
                        filterOperator: import("zod").ZodOptional<import("zod").ZodEnum<{
                            eq: "eq";
                            ne: "ne";
                            gt: "gt";
                            gte: "gte";
                            lt: "lt";
                            lte: "lte";
                            in: "in";
                            not_in: "not_in";
                            contains: "contains";
                            starts_with: "starts_with";
                            ends_with: "ends_with";
                        }>>;
                    }, import("zod/v4/core").$strip>;
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    users: {
                                                        type: string;
                                                        items: {
                                                            $ref: string;
                                                        };
                                                    };
                                                    total: {
                                                        type: string;
                                                    };
                                                    limit: {
                                                        type: string;
                                                    };
                                                    offset: {
                                                        type: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    users: import("better-auth/plugins/admin").UserWithRole[];
                    total: number;
                }>;
                listUserSessions: import("better-call").StrictEndpoint<"/admin/list-user-sessions", {
                    method: "POST";
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    sessions: {
                                                        type: string;
                                                        items: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    sessions: import("better-auth/plugins/admin").SessionWithImpersonatedBy[];
                }>;
                unbanUser: import("better-call").StrictEndpoint<"/admin/unban-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                banUser: import("better-call").StrictEndpoint<"/admin/ban-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                        banReason: import("zod").ZodOptional<import("zod").ZodString>;
                        banExpiresIn: import("zod").ZodOptional<import("zod").ZodNumber>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                impersonateUser: import("better-call").StrictEndpoint<"/admin/impersonate-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    session: {
                                                        $ref: string;
                                                    };
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    session: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                stopImpersonating: import("better-call").StrictEndpoint<"/admin/stop-impersonating", {
                    method: "POST";
                    requireHeaders: true;
                }, {
                    session: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    } & Record<string, any>;
                    user: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    } & Record<string, any>;
                }>;
                revokeUserSession: import("better-call").StrictEndpoint<"/admin/revoke-user-session", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        sessionToken: import("zod").ZodString;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    success: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    success: boolean;
                }>;
                revokeUserSessions: import("better-call").StrictEndpoint<"/admin/revoke-user-sessions", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    success: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    success: boolean;
                }>;
                removeUser: import("better-call").StrictEndpoint<"/admin/remove-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    success: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    success: boolean;
                }>;
                setUserPassword: import("better-call").StrictEndpoint<"/admin/set-user-password", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        newPassword: import("zod").ZodString;
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    status: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    status: boolean;
                }>;
                userHasPermission: import("better-call").StrictEndpoint<"/admin/has-permission", {
                    method: "POST";
                    body: import("zod").ZodIntersection<import("zod").ZodObject<{
                        userId: import("zod").ZodOptional<import("zod").ZodCoercedString<unknown>>;
                        role: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod/v4/core").$strip>, import("zod").ZodXor<readonly [import("zod").ZodObject<{
                        permission: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>>;
                    }, import("zod/v4/core").$strip>, import("zod").ZodObject<{
                        permissions: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>>;
                    }, import("zod/v4/core").$strip>]>>;
                    metadata: {
                        openapi: {
                            description: string;
                            requestBody: {
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                permissions: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                            responses: {
                                "200": {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    error: {
                                                        type: string;
                                                    };
                                                    success: {
                                                        type: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        $Infer: {
                            body: {
                                permissions: {
                                    readonly user?: ("set-role" | "create" | "list" | "ban" | "impersonate" | "impersonate-admins" | "delete" | "set-password" | "set-email" | "get" | "update")[] | undefined;
                                    readonly session?: ("list" | "delete" | "revoke")[] | undefined;
                                };
                            } & {
                                userId?: string | undefined;
                                role?: "admin" | "user" | undefined;
                            };
                        };
                    };
                }, {
                    error: null;
                    success: boolean;
                }>;
            };
            $ERROR_CODES: {
                USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: import("better-auth").RawError<"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL">;
                FAILED_TO_CREATE_USER: import("better-auth").RawError<"FAILED_TO_CREATE_USER">;
                USER_ALREADY_EXISTS: import("better-auth").RawError<"USER_ALREADY_EXISTS">;
                YOU_CANNOT_BAN_YOURSELF: import("better-auth").RawError<"YOU_CANNOT_BAN_YOURSELF">;
                YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE">;
                YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS">;
                YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_BAN_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS">;
                YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD">;
                BANNED_USER: import("better-auth").RawError<"BANNED_USER">;
                YOU_ARE_NOT_ALLOWED_TO_GET_USER: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_USER">;
                NO_DATA_TO_UPDATE: import("better-auth").RawError<"NO_DATA_TO_UPDATE">;
                YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS">;
                YOU_CANNOT_REMOVE_YOURSELF: import("better-auth").RawError<"YOU_CANNOT_REMOVE_YOURSELF">;
                YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE">;
                YOU_CANNOT_IMPERSONATE_ADMINS: import("better-auth").RawError<"YOU_CANNOT_IMPERSONATE_ADMINS">;
                INVALID_ROLE_TYPE: import("better-auth").RawError<"INVALID_ROLE_TYPE">;
                YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL">;
                PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER: import("better-auth").RawError<"PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER">;
            };
            schema: {
                user: {
                    fields: {
                        role: {
                            type: "string";
                            required: false;
                            input: false;
                        };
                        banned: {
                            type: "boolean";
                            defaultValue: false;
                            required: false;
                            input: false;
                        };
                        banReason: {
                            type: "string";
                            required: false;
                            input: false;
                        };
                        banExpires: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                    };
                };
                session: {
                    fields: {
                        impersonatedBy: {
                            type: "string";
                            required: false;
                            input: false;
                        };
                    };
                };
            };
            options: NoInfer<{
                adminRoles: string[];
            }>;
        }];
    }>>;
    n1: Effect.Effect<unknown, BetterAuthApiError, import("better-auth").Auth<{
        readonly secret: "proto-secret";
        readonly baseURL: "http://localhost:9999";
        readonly emailAndPassword: {
            readonly enabled: true;
        };
    }>>;
    n2: Effect.Effect<unknown, BetterAuthApiError, import("better-auth").Auth<{
        readonly secret: "proto-secret";
        readonly baseURL: "http://localhost:9999";
        readonly emailAndPassword: {
            readonly enabled: true;
        };
    }>>;
    n3: Effect.Effect<{
        redirect: boolean;
        token: string;
        url: string | undefined;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
        } & {
            username: string;
            displayUsername: string;
        };
    }, BetterAuthApiError, import("better-auth").Auth<{
        readonly secret: "proto-secret";
        readonly baseURL: "http://localhost:9999";
        readonly emailAndPassword: {
            readonly enabled: true;
        };
        readonly plugins: [{
            id: "username";
            version: string;
            init(ctx: import("better-auth").AuthContext): {
                options: {
                    databaseHooks: {
                        user: {
                            create: {
                                before(user: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    image?: string | null | undefined;
                                } & Record<string, unknown>, context: import("better-auth").GenericEndpointContext | null): Promise<{
                                    data: {
                                        username: string;
                                        displayUsername: string;
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image?: string | null | undefined;
                                    };
                                } | {
                                    data: {
                                        displayUsername?: string | undefined;
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image?: string | null | undefined;
                                    };
                                }>;
                            };
                            update: {
                                before(user: Partial<{
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    image?: string | null | undefined;
                                }> & Record<string, unknown>, context: import("better-auth").GenericEndpointContext | null): Promise<{
                                    data: {
                                        displayUsername?: string | undefined;
                                        username: string;
                                        id?: string | undefined;
                                        createdAt?: Date | undefined;
                                        updatedAt?: Date | undefined;
                                        email?: string | undefined;
                                        emailVerified?: boolean | undefined;
                                        name?: string | undefined;
                                        image?: string | null | undefined;
                                    };
                                } | {
                                    data: {
                                        displayUsername?: string | undefined;
                                        id?: string | undefined;
                                        createdAt?: Date | undefined;
                                        updatedAt?: Date | undefined;
                                        email?: string | undefined;
                                        emailVerified?: boolean | undefined;
                                        name?: string | undefined;
                                        image?: string | null | undefined;
                                    };
                                }>;
                            };
                        };
                    };
                };
            };
            endpoints: {
                signInUsername: import("better-call").StrictEndpoint<"/sign-in/username", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        username: import("zod").ZodString;
                        password: import("zod").ZodString;
                        rememberMe: import("zod").ZodOptional<import("zod").ZodBoolean>;
                        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod/v4/core").$strip>;
                    metadata: {
                        openapi: {
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    redirect: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    token: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    url: {
                                                        type: string;
                                                        nullable: boolean;
                                                        description: string;
                                                    };
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                    };
                                };
                                422: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    message: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    redirect: boolean;
                    token: string;
                    url: string | undefined;
                    user: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    } & {
                        username: string;
                        displayUsername: string;
                    };
                }>;
                isUsernameAvailable: import("better-call").StrictEndpoint<"/is-username-available", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        username: import("zod").ZodString;
                    }, import("zod/v4/core").$strip>;
                }, {
                    available: boolean;
                }>;
            };
            schema: {
                user: {
                    fields: {
                        username: {
                            type: "string";
                            required: false;
                            sortable: true;
                            unique: true;
                            returned: true;
                            transform: {
                                input(value: import("better-auth").DBPrimitive): string | number | boolean | Date | Record<string, unknown> | unknown[] | null | undefined;
                            };
                        };
                        displayUsername: {
                            type: "string";
                            required: false;
                            transform: {
                                input(value: import("better-auth").DBPrimitive): string | number | boolean | Date | Record<string, unknown> | unknown[] | null | undefined;
                            };
                        };
                    };
                };
            };
            hooks: {
                before: {
                    matcher(context: import("better-auth").HookEndpointContext): boolean;
                    handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
                }[];
            };
            options: import("better-auth/plugins/username").UsernameOptions | undefined;
            $ERROR_CODES: {
                EMAIL_NOT_VERIFIED: import("better-auth").RawError<"EMAIL_NOT_VERIFIED">;
                UNEXPECTED_ERROR: import("better-auth").RawError<"UNEXPECTED_ERROR">;
                INVALID_USERNAME_OR_PASSWORD: import("better-auth").RawError<"INVALID_USERNAME_OR_PASSWORD">;
                USERNAME_IS_ALREADY_TAKEN: import("better-auth").RawError<"USERNAME_IS_ALREADY_TAKEN">;
                USERNAME_TOO_SHORT: import("better-auth").RawError<"USERNAME_TOO_SHORT">;
                USERNAME_TOO_LONG: import("better-auth").RawError<"USERNAME_TOO_LONG">;
                INVALID_USERNAME: import("better-auth").RawError<"INVALID_USERNAME">;
                INVALID_DISPLAY_USERNAME: import("better-auth").RawError<"INVALID_DISPLAY_USERNAME">;
            };
        }, {
            id: "admin";
            version: string;
            init(): {
                options: {
                    databaseHooks: {
                        user: {
                            create: {
                                before(user: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    image?: string | null | undefined;
                                } & Record<string, unknown>): Promise<{
                                    data: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image?: string | null | undefined;
                                        role: string;
                                    };
                                }>;
                            };
                        };
                        session: {
                            create: {
                                before(session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                } & Record<string, unknown>, ctx: import("better-auth").GenericEndpointContext | null): Promise<void>;
                            };
                        };
                    };
                };
            };
            hooks: {
                after: {
                    matcher(context: import("better-auth").HookEndpointContext): boolean;
                    handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<import("better-auth/plugins/admin").SessionWithImpersonatedBy[] | undefined>;
                }[];
            };
            endpoints: {
                setRole: import("better-call").StrictEndpoint<"/admin/set-role", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                        role: import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>]>;
                    }, import("zod/v4/core").$strip>;
                    requireHeaders: true;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        $Infer: {
                            body: {
                                userId: string;
                                role: "admin" | "user" | ("admin" | "user")[];
                            };
                        };
                    };
                }, {
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                getUser: import("better-call").StrictEndpoint<"/admin/get-user", {
                    method: "GET";
                    query: import("zod").ZodObject<{
                        id: import("zod").ZodString;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, import("better-auth/plugins/admin").UserWithRole>;
                createUser: import("better-call").StrictEndpoint<"/admin/create-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        email: import("zod").ZodString;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                        name: import("zod").ZodString;
                        role: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>]>>;
                        data: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
                    }, import("zod/v4/core").$strip>;
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        $Infer: {
                            body: {
                                email: string;
                                password?: string | undefined;
                                name: string;
                                role?: "admin" | "user" | ("admin" | "user")[] | undefined;
                                data?: Record<string, any> | undefined;
                            };
                        };
                    };
                }, {
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                adminUpdateUser: import("better-call").StrictEndpoint<"/admin/update-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                        data: import("zod").ZodRecord<import("zod").ZodAny, import("zod").ZodAny>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, import("better-auth/plugins/admin").UserWithRole>;
                listUsers: import("better-call").StrictEndpoint<"/admin/list-users", {
                    method: "GET";
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    query: import("zod").ZodObject<{
                        searchValue: import("zod").ZodOptional<import("zod").ZodString>;
                        searchField: import("zod").ZodOptional<import("zod").ZodEnum<{
                            email: "email";
                            name: "name";
                        }>>;
                        searchOperator: import("zod").ZodOptional<import("zod").ZodEnum<{
                            contains: "contains";
                            starts_with: "starts_with";
                            ends_with: "ends_with";
                        }>>;
                        limit: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
                        offset: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
                        sortBy: import("zod").ZodOptional<import("zod").ZodString>;
                        sortDirection: import("zod").ZodOptional<import("zod").ZodEnum<{
                            asc: "asc";
                            desc: "desc";
                        }>>;
                        filterField: import("zod").ZodOptional<import("zod").ZodString>;
                        filterValue: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>, import("zod").ZodBoolean]>, import("zod").ZodArray<import("zod").ZodString>]>, import("zod").ZodArray<import("zod").ZodNumber>]>>;
                        filterOperator: import("zod").ZodOptional<import("zod").ZodEnum<{
                            eq: "eq";
                            ne: "ne";
                            gt: "gt";
                            gte: "gte";
                            lt: "lt";
                            lte: "lte";
                            in: "in";
                            not_in: "not_in";
                            contains: "contains";
                            starts_with: "starts_with";
                            ends_with: "ends_with";
                        }>>;
                    }, import("zod/v4/core").$strip>;
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    users: {
                                                        type: string;
                                                        items: {
                                                            $ref: string;
                                                        };
                                                    };
                                                    total: {
                                                        type: string;
                                                    };
                                                    limit: {
                                                        type: string;
                                                    };
                                                    offset: {
                                                        type: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    users: import("better-auth/plugins/admin").UserWithRole[];
                    total: number;
                }>;
                listUserSessions: import("better-call").StrictEndpoint<"/admin/list-user-sessions", {
                    method: "POST";
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    sessions: {
                                                        type: string;
                                                        items: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    sessions: import("better-auth/plugins/admin").SessionWithImpersonatedBy[];
                }>;
                unbanUser: import("better-call").StrictEndpoint<"/admin/unban-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                banUser: import("better-call").StrictEndpoint<"/admin/ban-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                        banReason: import("zod").ZodOptional<import("zod").ZodString>;
                        banExpiresIn: import("zod").ZodOptional<import("zod").ZodNumber>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                impersonateUser: import("better-call").StrictEndpoint<"/admin/impersonate-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    session: {
                                                        $ref: string;
                                                    };
                                                    user: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    session: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: import("better-auth/plugins/admin").UserWithRole;
                }>;
                stopImpersonating: import("better-call").StrictEndpoint<"/admin/stop-impersonating", {
                    method: "POST";
                    requireHeaders: true;
                }, {
                    session: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    } & Record<string, any>;
                    user: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    } & Record<string, any>;
                }>;
                revokeUserSession: import("better-call").StrictEndpoint<"/admin/revoke-user-session", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        sessionToken: import("zod").ZodString;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    success: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    success: boolean;
                }>;
                revokeUserSessions: import("better-call").StrictEndpoint<"/admin/revoke-user-sessions", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    success: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    success: boolean;
                }>;
                removeUser: import("better-call").StrictEndpoint<"/admin/remove-user", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    success: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    success: boolean;
                }>;
                setUserPassword: import("better-call").StrictEndpoint<"/admin/set-user-password", {
                    method: "POST";
                    body: import("zod").ZodObject<{
                        newPassword: import("zod").ZodString;
                        userId: import("zod").ZodCoercedString<unknown>;
                    }, import("zod/v4/core").$strip>;
                    use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                        session: {
                            user: import("better-auth/plugins/admin").UserWithRole;
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                        };
                    }>)[];
                    metadata: {
                        openapi: {
                            operationId: string;
                            summary: string;
                            description: string;
                            responses: {
                                200: {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    status: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                }, {
                    status: boolean;
                }>;
                userHasPermission: import("better-call").StrictEndpoint<"/admin/has-permission", {
                    method: "POST";
                    body: import("zod").ZodIntersection<import("zod").ZodObject<{
                        userId: import("zod").ZodOptional<import("zod").ZodCoercedString<unknown>>;
                        role: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod/v4/core").$strip>, import("zod").ZodXor<readonly [import("zod").ZodObject<{
                        permission: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>>;
                    }, import("zod/v4/core").$strip>, import("zod").ZodObject<{
                        permissions: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>>;
                    }, import("zod/v4/core").$strip>]>>;
                    metadata: {
                        openapi: {
                            description: string;
                            requestBody: {
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                permissions: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                            responses: {
                                "200": {
                                    description: string;
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    error: {
                                                        type: string;
                                                    };
                                                    success: {
                                                        type: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        $Infer: {
                            body: {
                                permissions: {
                                    readonly user?: ("set-role" | "create" | "list" | "ban" | "impersonate" | "impersonate-admins" | "delete" | "set-password" | "set-email" | "get" | "update")[] | undefined;
                                    readonly session?: ("list" | "delete" | "revoke")[] | undefined;
                                };
                            } & {
                                userId?: string | undefined;
                                role?: "admin" | "user" | undefined;
                            };
                        };
                    };
                }, {
                    error: null;
                    success: boolean;
                }>;
            };
            $ERROR_CODES: {
                USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: import("better-auth").RawError<"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL">;
                FAILED_TO_CREATE_USER: import("better-auth").RawError<"FAILED_TO_CREATE_USER">;
                USER_ALREADY_EXISTS: import("better-auth").RawError<"USER_ALREADY_EXISTS">;
                YOU_CANNOT_BAN_YOURSELF: import("better-auth").RawError<"YOU_CANNOT_BAN_YOURSELF">;
                YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE">;
                YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS">;
                YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_BAN_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS">;
                YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD">;
                BANNED_USER: import("better-auth").RawError<"BANNED_USER">;
                YOU_ARE_NOT_ALLOWED_TO_GET_USER: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_USER">;
                NO_DATA_TO_UPDATE: import("better-auth").RawError<"NO_DATA_TO_UPDATE">;
                YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS">;
                YOU_CANNOT_REMOVE_YOURSELF: import("better-auth").RawError<"YOU_CANNOT_REMOVE_YOURSELF">;
                YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE">;
                YOU_CANNOT_IMPERSONATE_ADMINS: import("better-auth").RawError<"YOU_CANNOT_IMPERSONATE_ADMINS">;
                INVALID_ROLE_TYPE: import("better-auth").RawError<"INVALID_ROLE_TYPE">;
                YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL: import("better-auth").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL">;
                PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER: import("better-auth").RawError<"PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER">;
            };
            schema: {
                user: {
                    fields: {
                        role: {
                            type: "string";
                            required: false;
                            input: false;
                        };
                        banned: {
                            type: "boolean";
                            defaultValue: false;
                            required: false;
                            input: false;
                        };
                        banReason: {
                            type: "string";
                            required: false;
                            input: false;
                        };
                        banExpires: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                    };
                };
                session: {
                    fields: {
                        impersonatedBy: {
                            type: "string";
                            required: false;
                            input: false;
                        };
                    };
                };
            };
            options: NoInfer<{
                adminRoles: string[];
            }>;
        }];
    }>>;
    AuthALive: Layer.Layer<AuthA, never, never>;
    _b1ErrorIsTagged: true;
    _b1ResultTyped: true;
};
export {};
