/**
 * THROWAWAY PROTOTYPE — spec amendment probe (post ticket #6).
 *
 * Question: can an effectful `api` proxy replace the `call` combinator with
 * drizzle-like DX — `yield* auth.api.listUsers({...})` returning
 * `Effect<A, BetterAuthApiError>` — while preserving plugin-inferred input
 * and result types? And what happens to the generic `asResponse` /
 * `returnHeaders` flags under the mapped type?
 */
import { type BetterAuthOptions } from 'better-auth';
import { Context, Effect, Layer } from 'effect';
import { BetterAuthApiError } from './prototype.js';
export type EffectApi<Api> = {
    readonly [K in keyof Api as Api[K] extends (...args: never[]) => Promise<unknown> ? K : never]: Api[K] extends (...args: infer P) => Promise<infer R> ? (...args: P) => Effect.Effect<R, BetterAuthApiError> : never;
};
export declare const effectApi: <Api extends Record<string, unknown>>(api: Api) => EffectApi<Api>;
export declare const wrap: <const O extends BetterAuthOptions>(options: O) => {
    readonly api: EffectApi<import("better-auth").InferAPI<import("better-auth").UnionToIntersection<O["plugins"] extends (infer T)[] ? T extends import("better-auth").BetterAuthPlugin ? T extends {
        endpoints: infer E;
    } ? E : {} : {} : {}> extends infer T_1 ? T_1 extends import("better-auth").UnionToIntersection<O["plugins"] extends (infer T_2)[] ? T_2 extends import("better-auth").BetterAuthPlugin ? T_2 extends {
        endpoints: infer E_1;
    } ? E_1 : {} : {} : {}> ? T_1 extends unknown ? import("better-auth").Prettify<({
        readonly ok: import("better-call").StrictEndpoint<"/ok", {
            method: "GET";
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            ok: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                    };
                };
                scope: "server";
            };
        }, {
            ok: boolean;
        }>;
        readonly error: import("better-call").StrictEndpoint<"/error", {
            method: "GET";
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "text/html": {
                                    schema: {
                                        type: "string";
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
                scope: "server";
            };
        }, Response>;
        readonly signInSocial: import("better-call").StrictEndpoint<"/sign-in/social", {
            method: "POST";
            operationId: string;
            body: import("zod").ZodObject<{
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                newUserCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                errorCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                provider: import("zod").ZodType<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown, import("zod/v4/core").$ZodTypeInternals<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown>>;
                disableRedirect: import("zod").ZodOptional<import("zod").ZodBoolean>;
                idToken: import("zod").ZodOptional<import("zod").ZodObject<{
                    token: import("zod").ZodString;
                    nonce: import("zod").ZodOptional<import("zod").ZodString>;
                    accessToken: import("zod").ZodOptional<import("zod").ZodString>;
                    refreshToken: import("zod").ZodOptional<import("zod").ZodString>;
                    expiresAt: import("zod").ZodOptional<import("zod").ZodNumber>;
                    user: import("zod").ZodOptional<import("zod").ZodObject<{
                        name: import("zod").ZodOptional<import("zod").ZodObject<{
                            firstName: import("zod").ZodOptional<import("zod").ZodString>;
                            lastName: import("zod").ZodOptional<import("zod").ZodString>;
                        }, import("zod/v4/core").$strip>>;
                        email: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod/v4/core").$strip>>;
                }, import("zod/v4/core").$strip>>;
                scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                requestSignUp: import("zod").ZodOptional<import("zod").ZodBoolean>;
                loginHint: import("zod").ZodOptional<import("zod").ZodString>;
                additionalData: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                $Infer: {
                    body: {
                        provider: (string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat";
                        callbackURL?: string | undefined;
                        newUserCallbackURL?: string | undefined;
                        errorCallbackURL?: string | undefined;
                        disableRedirect?: boolean | undefined;
                        idToken?: {
                            token: string;
                            nonce?: string | undefined;
                            accessToken?: string | undefined;
                            refreshToken?: string | undefined;
                            expiresAt?: number | undefined;
                            user?: {
                                name?: {
                                    firstName?: string | undefined;
                                    lastName?: string | undefined;
                                } | undefined;
                                email?: string | undefined;
                            } | undefined;
                        } | undefined;
                        scopes?: string[] | undefined;
                        requestSignUp?: boolean | undefined;
                        loginHint?: string | undefined;
                        additionalData?: Record<string, any> | undefined;
                    };
                    returned: {
                        redirect: boolean;
                        token?: string | undefined;
                        url?: string | undefined;
                        user?: ({
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image?: string | null | undefined;
                        } & import("better-auth").InferDBFieldsFromOptions<O["user"]> & import("better-auth").InferDBFieldsFromPlugins<"user", O["plugins"]> extends infer T_3_1 ? { [K_1 in keyof T_3_1]: T_3_1[K_1]; } : never) | undefined;
                    };
                };
                openapi: {
                    description: string;
                    operationId: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        description: string;
                                        properties: {
                                            token: {
                                                type: string;
                                            };
                                            user: {
                                                type: string;
                                                $ref: string;
                                            };
                                            url: {
                                                type: string;
                                            };
                                            redirect: {
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
            redirect: boolean;
            url: string;
        } | {
            redirect: boolean;
            token: string;
            url: undefined;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & import("better-auth").InferDBFieldsFromOptions<O["user"]> & import("better-auth").InferDBFieldsFromPlugins<"user", O["plugins"]> extends infer T_4 ? { [K_1_1 in keyof T_4]: T_4[K_1_1]; } : never;
        }>;
        readonly callbackOAuth: import("better-call").StrictEndpoint<"/callback/:id", {
            method: ("GET" | "POST")[];
            operationId: string;
            body: import("zod").ZodOptional<import("zod").ZodObject<{
                code: import("zod").ZodOptional<import("zod").ZodString>;
                error: import("zod").ZodOptional<import("zod").ZodString>;
                device_id: import("zod").ZodOptional<import("zod").ZodString>;
                error_description: import("zod").ZodOptional<import("zod").ZodString>;
                state: import("zod").ZodOptional<import("zod").ZodString>;
                user: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            query: import("zod").ZodOptional<import("zod").ZodObject<{
                code: import("zod").ZodOptional<import("zod").ZodString>;
                error: import("zod").ZodOptional<import("zod").ZodString>;
                device_id: import("zod").ZodOptional<import("zod").ZodString>;
                error_description: import("zod").ZodOptional<import("zod").ZodString>;
                state: import("zod").ZodOptional<import("zod").ZodString>;
                user: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            metadata: {
                allowedMediaTypes: string[];
                scope: "server";
            };
        }, never>;
        readonly getSession: import("better-call").StrictEndpoint<"/get-session", {
            method: ("GET" | "POST")[];
            operationId: string;
            query: import("zod").ZodOptional<import("zod").ZodObject<{
                disableCookieCache: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
                disableRefresh: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
            }, import("zod/v4/core").$strip>>;
            requireHeaders: true;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
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
                                        required: string[];
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
            } & import("better-auth").InferDBFieldsFromOptions<O["session"]> & import("better-auth").InferDBFieldsFromPlugins<"session", O["plugins"]> extends infer T_5 ? { [K_2 in keyof T_5]: T_5[K_2]; } : never;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & import("better-auth").InferDBFieldsFromOptions<O["user"]> & import("better-auth").InferDBFieldsFromPlugins<"user", O["plugins"]> extends infer T_6 ? { [K_1_2 in keyof T_6]: T_6[K_1_2]; } : never;
        } | null>;
        readonly signOut: import("better-call").StrictEndpoint<"/sign-out", {
            method: "POST";
            operationId: string;
            requireHeaders: true;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
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
        readonly signUpEmail: import("better-call").StrictEndpoint<"/sign-up/email", {
            method: "POST";
            operationId: string;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
            body: import("zod").ZodIntersection<import("zod").ZodObject<{
                name: import("zod").ZodString;
                email: import("zod").ZodEmail;
                password: import("zod").ZodString;
                image: import("zod").ZodOptional<import("zod").ZodString>;
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                rememberMe: import("zod").ZodOptional<import("zod").ZodBoolean>;
            }, import("zod/v4/core").$strip>, import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
            cloneRequest: true;
            metadata: {
                allowedMediaTypes: string[];
                $Infer: {
                    body: {
                        name: string;
                        email: string;
                        password: string;
                        image?: string | undefined;
                        callbackURL?: string | undefined;
                        rememberMe?: boolean | undefined;
                    } & import("better-auth").InferDBFieldsFromPluginsInput<"user", O["plugins"]> & import("better-auth").InferDBFieldsFromOptionsInput<O["user"]>;
                    returned: {
                        token: string | null;
                        user: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image?: string | null | undefined;
                        } & import("better-auth").InferDBFieldsFromOptions<O["user"]> & import("better-auth").InferDBFieldsFromPlugins<"user", O["plugins"]> extends infer T_7 ? { [K_1_3 in keyof T_7]: T_7[K_1_3]; } : never;
                    };
                };
                openapi: {
                    operationId: string;
                    description: string;
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object";
                                    properties: {
                                        name: {
                                            type: string;
                                            description: string;
                                        };
                                        email: {
                                            type: string;
                                            description: string;
                                        };
                                        password: {
                                            type: string;
                                            description: string;
                                        };
                                        image: {
                                            type: string;
                                            description: string;
                                        };
                                        callbackURL: {
                                            type: string;
                                            description: string;
                                        };
                                        rememberMe: {
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
                                            token: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            user: {
                                                type: string;
                                                properties: {
                                                    id: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    email: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    image: {
                                                        type: string;
                                                        format: string;
                                                        nullable: boolean;
                                                        description: string;
                                                    };
                                                    emailVerified: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    createdAt: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                    updatedAt: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        "422": {
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
            token: null;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & import("better-auth").InferDBFieldsFromOptions<O["user"]> & import("better-auth").InferDBFieldsFromPlugins<"user", O["plugins"]> extends infer T_8 ? { [K_1_4 in keyof T_8]: T_8[K_1_4]; } : never;
        } | {
            token: string;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & import("better-auth").InferDBFieldsFromOptions<O["user"]> & import("better-auth").InferDBFieldsFromPlugins<"user", O["plugins"]> extends infer T_9 ? { [K_1_5 in keyof T_9]: T_9[K_1_5]; } : never;
        }>;
        readonly signInEmail: import("better-call").StrictEndpoint<"/sign-in/email", {
            method: "POST";
            operationId: string;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
            cloneRequest: true;
            body: import("zod").ZodObject<{
                email: import("zod").ZodString;
                password: import("zod").ZodString;
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                rememberMe: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodBoolean>>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                allowedMediaTypes: string[];
                $Infer: {
                    body: {
                        email: string;
                        password: string;
                        callbackURL?: string | undefined;
                        rememberMe?: boolean | undefined;
                    };
                    returned: {
                        redirect: boolean;
                        token: string;
                        url?: string | undefined;
                        user: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image?: string | null | undefined;
                        } & import("better-auth").InferDBFieldsFromOptions<O["user"]> & import("better-auth").InferDBFieldsFromPlugins<"user", O["plugins"]> extends infer T_10 ? { [K_1_6 in keyof T_10]: T_10[K_1_6]; } : never;
                    };
                };
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        description: string;
                                        properties: {
                                            redirect: {
                                                type: string;
                                                enum: boolean[];
                                            };
                                            token: {
                                                type: string;
                                                description: string;
                                            };
                                            url: {
                                                type: string;
                                                nullable: boolean;
                                            };
                                            user: {
                                                type: string;
                                                $ref: string;
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
            redirect: boolean;
            token: string;
            url?: string | undefined;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & import("better-auth").InferDBFieldsFromOptions<O["user"]> & import("better-auth").InferDBFieldsFromPlugins<"user", O["plugins"]> extends infer T_11 ? { [K_1_7 in keyof T_11]: T_11[K_1_7]; } : never;
        }>;
        readonly resetPassword: import("better-call").StrictEndpoint<"/reset-password", {
            method: "POST";
            operationId: string;
            query: import("zod").ZodOptional<import("zod").ZodObject<{
                token: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            body: import("zod").ZodObject<{
                newPassword: import("zod").ZodString;
                token: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
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
        readonly verifyPassword: import("better-call").StrictEndpoint<"/verify-password", {
            method: "POST";
            body: import("zod").ZodObject<{
                password: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            metadata: {
                scope: "server";
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
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
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
        }, {
            status: boolean;
        }>;
        readonly verifyEmail: import("better-call").StrictEndpoint<"/verify-email", {
            method: "GET";
            operationId: string;
            query: import("zod").ZodObject<{
                token: import("zod").ZodString;
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
            metadata: {
                openapi: {
                    description: string;
                    parameters: ({
                        name: string;
                        in: "query";
                        description: string;
                        required: true;
                        schema: {
                            type: "string";
                        };
                    } | {
                        name: string;
                        in: "query";
                        description: string;
                        required: false;
                        schema: {
                            type: "string";
                        };
                    })[];
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            user: {
                                                type: string;
                                                $ref: string;
                                            };
                                            status: {
                                                type: string;
                                                description: string;
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
        }, void | {
            status: boolean;
        }>;
        readonly sendVerificationEmail: import("better-call").StrictEndpoint<"/send-verification-email", {
            method: "POST";
            operationId: string;
            cloneRequest: true;
            body: import("zod").ZodObject<{
                email: import("zod").ZodEmail;
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object";
                                    properties: {
                                        email: {
                                            type: string;
                                            description: string;
                                            example: string;
                                        };
                                        callbackURL: {
                                            type: string;
                                            description: string;
                                            example: string;
                                            nullable: boolean;
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
                                            status: {
                                                type: string;
                                                description: string;
                                                example: boolean;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        "400": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            message: {
                                                type: string;
                                                description: string;
                                                example: string;
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
        readonly changeEmail: import("better-call").StrictEndpoint<"/change-email", {
            method: "POST";
            body: import("zod").ZodObject<{
                newEmail: import("zod").ZodEmail;
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    operationId: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            user: {
                                                type: string;
                                                $ref: string;
                                            };
                                            status: {
                                                type: string;
                                                description: string;
                                            };
                                            message: {
                                                type: string;
                                                enum: string[];
                                                description: string;
                                                nullable: boolean;
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
            status: boolean;
        }>;
        readonly changePassword: import("better-call").StrictEndpoint<"/change-password", {
            method: "POST";
            operationId: string;
            body: import("zod").ZodObject<{
                newPassword: import("zod").ZodString;
                currentPassword: import("zod").ZodString;
                revokeOtherSessions: import("zod").ZodOptional<import("zod").ZodBoolean>;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            token: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            user: {
                                                type: string;
                                                properties: {
                                                    id: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    email: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    image: {
                                                        type: string;
                                                        format: string;
                                                        nullable: boolean;
                                                        description: string;
                                                    };
                                                    emailVerified: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    createdAt: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                    updatedAt: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                };
                                                required: string[];
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
            token: string | null;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        }>;
        readonly setPassword: import("better-call").StrictEndpoint<string, {
            method: "POST";
            body: import("zod").ZodObject<{
                newPassword: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
        }, {
            status: boolean;
        }>;
        readonly updateSession: import("better-call").StrictEndpoint<"/update-session", {
            method: "POST";
            operationId: string;
            body: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                $Infer: {
                    body: Partial<import("better-auth").AdditionalSessionFieldsInput<O>>;
                };
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            session: {
                                                type: string;
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
        }>;
        readonly updateUser: import("better-call").StrictEndpoint<"/update-user", {
            method: "POST";
            operationId: string;
            body: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                $Infer: {
                    body: Partial<import("better-auth").AdditionalUserFieldsInput<O>> & {
                        name?: string | undefined;
                        image?: string | undefined | null;
                    };
                };
                openapi: {
                    operationId: string;
                    description: string;
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object";
                                    properties: {
                                        name: {
                                            type: string;
                                            description: string;
                                        };
                                        image: {
                                            type: string;
                                            description: string;
                                            nullable: boolean;
                                        };
                                    };
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
                                            user: {
                                                type: string;
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
            status: boolean;
        }>;
        readonly deleteUser: import("better-call").StrictEndpoint<"/delete-user", {
            method: "POST";
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            body: import("zod").ZodObject<{
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                password: import("zod").ZodOptional<import("zod").ZodString>;
                token: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object";
                                    properties: {
                                        callbackURL: {
                                            type: string;
                                            description: string;
                                        };
                                        password: {
                                            type: string;
                                            description: string;
                                        };
                                        token: {
                                            type: string;
                                            description: string;
                                        };
                                    };
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
                                            success: {
                                                type: string;
                                                description: string;
                                            };
                                            message: {
                                                type: string;
                                                enum: string[];
                                                description: string;
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
            success: boolean;
            message: string;
        }>;
        readonly requestPasswordReset: import("better-call").StrictEndpoint<"/request-password-reset", {
            method: "POST";
            body: import("zod").ZodObject<{
                email: import("zod").ZodEmail;
                redirectTo: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            status: {
                                                type: string;
                                            };
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
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
        }, {
            status: boolean;
            message: string;
        }>;
        readonly requestPasswordResetCallback: import("better-call").StrictEndpoint<"/reset-password/:token", {
            method: "GET";
            operationId: string;
            query: import("zod").ZodObject<{
                callbackURL: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    parameters: ({
                        name: string;
                        in: "path";
                        required: true;
                        description: string;
                        schema: {
                            type: "string";
                        };
                    } | {
                        name: string;
                        in: "query";
                        required: true;
                        description: string;
                        schema: {
                            type: "string";
                        };
                    })[];
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            token: {
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
        }, never>;
        readonly listSessions: import("better-call").StrictEndpoint<"/list-sessions", {
            method: "GET";
            operationId: string;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            requireHeaders: true;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array";
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
        }, import("better-auth").Prettify<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
        } & import("better-auth").InferDBFieldsFromOptions<O["session"]> & import("better-auth").InferDBFieldsFromPlugins<"session", O["plugins"]> extends infer T_12 ? { [K_2_1 in keyof T_12]: T_12[K_2_1]; } : never>[]>;
        readonly revokeSession: import("better-call").StrictEndpoint<"/revoke-session", {
            method: "POST";
            body: import("zod").ZodObject<{
                token: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            requireHeaders: true;
            metadata: {
                openapi: {
                    description: string;
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object";
                                    properties: {
                                        token: {
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
                                            status: {
                                                type: string;
                                                description: string;
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
            status: boolean;
        }>;
        readonly revokeSessions: import("better-call").StrictEndpoint<"/revoke-sessions", {
            method: "POST";
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            requireHeaders: true;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            status: {
                                                type: string;
                                                description: string;
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
            status: boolean;
        }>;
        readonly revokeOtherSessions: import("better-call").StrictEndpoint<"/revoke-other-sessions", {
            method: "POST";
            requireHeaders: true;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            status: {
                                                type: string;
                                                description: string;
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
            status: boolean;
        }>;
        readonly linkSocialAccount: import("better-call").StrictEndpoint<"/link-social", {
            method: "POST";
            requireHeaders: true;
            body: import("zod").ZodObject<{
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                provider: import("zod").ZodType<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown, import("zod/v4/core").$ZodTypeInternals<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown>>;
                idToken: import("zod").ZodOptional<import("zod").ZodObject<{
                    token: import("zod").ZodString;
                    nonce: import("zod").ZodOptional<import("zod").ZodString>;
                    accessToken: import("zod").ZodOptional<import("zod").ZodString>;
                    refreshToken: import("zod").ZodOptional<import("zod").ZodString>;
                    scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                }, import("zod/v4/core").$strip>>;
                requestSignUp: import("zod").ZodOptional<import("zod").ZodBoolean>;
                scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                errorCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                disableRedirect: import("zod").ZodOptional<import("zod").ZodBoolean>;
                additionalData: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    description: string;
                    operationId: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            url: {
                                                type: string;
                                                description: string;
                                            };
                                            redirect: {
                                                type: string;
                                                description: string;
                                            };
                                            status: {
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
            url: string;
            redirect: boolean;
        }>;
        readonly listUserAccounts: import("better-call").StrictEndpoint<"/list-accounts", {
            method: "GET";
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array";
                                        items: {
                                            type: string;
                                            properties: {
                                                id: {
                                                    type: string;
                                                };
                                                providerId: {
                                                    type: string;
                                                };
                                                createdAt: {
                                                    type: string;
                                                    format: string;
                                                };
                                                updatedAt: {
                                                    type: string;
                                                    format: string;
                                                };
                                                accountId: {
                                                    type: string;
                                                };
                                                userId: {
                                                    type: string;
                                                };
                                                scopes: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                    };
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
            };
        }, {
            scopes: string[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            providerId: string;
            accountId: string;
        }[]>;
        readonly deleteUserCallback: import("better-call").StrictEndpoint<"/delete-user/callback", {
            method: "GET";
            query: import("zod").ZodObject<{
                token: import("zod").ZodString;
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            success: {
                                                type: string;
                                                description: string;
                                            };
                                            message: {
                                                type: string;
                                                enum: string[];
                                                description: string;
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
            success: boolean;
            message: string;
        }>;
        readonly unlinkAccount: import("better-call").StrictEndpoint<"/unlink-account", {
            method: "POST";
            body: import("zod").ZodObject<{
                providerId: import("zod").ZodString;
                accountId: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
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
        readonly refreshToken: import("better-call").StrictEndpoint<"/refresh-token", {
            method: "POST";
            body: import("zod").ZodObject<{
                providerId: import("zod").ZodString;
                accountId: import("zod").ZodOptional<import("zod").ZodString>;
                userId: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        200: {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            tokenType: {
                                                type: string;
                                            };
                                            idToken: {
                                                type: string;
                                            };
                                            accessToken: {
                                                type: string;
                                            };
                                            refreshToken: {
                                                type: string;
                                            };
                                            accessTokenExpiresAt: {
                                                type: string;
                                                format: string;
                                            };
                                            refreshTokenExpiresAt: {
                                                type: string;
                                                format: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        400: {
                            description: string;
                        };
                    };
                };
            };
        }, {
            accessToken: string | undefined;
            refreshToken: string;
            accessTokenExpiresAt: Date | undefined;
            refreshTokenExpiresAt: Date | null | undefined;
            scope: string | null | undefined;
            idToken: string | null | undefined;
            providerId: string;
            accountId: string;
        }>;
        readonly getAccessToken: import("better-call").StrictEndpoint<"/get-access-token", {
            method: "POST";
            body: import("zod").ZodObject<{
                providerId: import("zod").ZodString;
                accountId: import("zod").ZodOptional<import("zod").ZodString>;
                userId: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        200: {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            tokenType: {
                                                type: string;
                                            };
                                            idToken: {
                                                type: string;
                                            };
                                            accessToken: {
                                                type: string;
                                            };
                                            accessTokenExpiresAt: {
                                                type: string;
                                                format: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        400: {
                            description: string;
                        };
                    };
                };
            };
        }, {
            accessToken: string;
            accessTokenExpiresAt: Date | undefined;
            scopes: string[];
            idToken: string | undefined;
        }>;
        readonly accountInfo: import("better-call").StrictEndpoint<"/account-info", {
            method: "GET";
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            user: {
                                                type: string;
                                                properties: {
                                                    id: {
                                                        type: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                    };
                                                    email: {
                                                        type: string;
                                                    };
                                                    image: {
                                                        type: string;
                                                    };
                                                    emailVerified: {
                                                        type: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                            data: {
                                                type: string;
                                                properties: {};
                                                additionalProperties: boolean;
                                            };
                                        };
                                        required: string[];
                                        additionalProperties: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            query: import("zod").ZodOptional<import("zod").ZodObject<{
                accountId: import("zod").ZodOptional<import("zod").ZodString>;
                providerId: import("zod").ZodOptional<import("zod").ZodString>;
                userId: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
        }, {
            user: import("better-auth").OAuth2UserInfo;
            data: Record<string, any>;
        } | null>;
    } extends infer T_3 ? { [K in keyof T_3 as K extends keyof T_1 ? never : K]: T_3[K]; } : never) & T_1> : never : never : never>>;
    readonly instance: import("better-auth").Auth<O>;
};
declare const AuthP_base: Context.ServiceClass<AuthP, "proto/AuthP", {
    readonly api: EffectApi<import("better-auth").InferAPI<import("better-auth").Prettify<{
        readonly ok: import("better-call").StrictEndpoint<"/ok", {
            method: "GET";
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            ok: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                    };
                };
                scope: "server";
            };
        }, {
            ok: boolean;
        }>;
        readonly error: import("better-call").StrictEndpoint<"/error", {
            method: "GET";
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "text/html": {
                                    schema: {
                                        type: "string";
                                        description: string;
                                    };
                                };
                            };
                        };
                    };
                };
                scope: "server";
            };
        }, Response>;
        readonly signInSocial: import("better-call").StrictEndpoint<"/sign-in/social", {
            method: "POST";
            operationId: string;
            body: import("zod").ZodObject<{
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                newUserCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                errorCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                provider: import("zod").ZodType<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown, import("zod/v4/core").$ZodTypeInternals<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown>>;
                disableRedirect: import("zod").ZodOptional<import("zod").ZodBoolean>;
                idToken: import("zod").ZodOptional<import("zod").ZodObject<{
                    token: import("zod").ZodString;
                    nonce: import("zod").ZodOptional<import("zod").ZodString>;
                    accessToken: import("zod").ZodOptional<import("zod").ZodString>;
                    refreshToken: import("zod").ZodOptional<import("zod").ZodString>;
                    expiresAt: import("zod").ZodOptional<import("zod").ZodNumber>;
                    user: import("zod").ZodOptional<import("zod").ZodObject<{
                        name: import("zod").ZodOptional<import("zod").ZodObject<{
                            firstName: import("zod").ZodOptional<import("zod").ZodString>;
                            lastName: import("zod").ZodOptional<import("zod").ZodString>;
                        }, import("zod/v4/core").$strip>>;
                        email: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod/v4/core").$strip>>;
                }, import("zod/v4/core").$strip>>;
                scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                requestSignUp: import("zod").ZodOptional<import("zod").ZodBoolean>;
                loginHint: import("zod").ZodOptional<import("zod").ZodString>;
                additionalData: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                $Infer: {
                    body: {
                        provider: (string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat";
                        callbackURL?: string | undefined;
                        newUserCallbackURL?: string | undefined;
                        errorCallbackURL?: string | undefined;
                        disableRedirect?: boolean | undefined;
                        idToken?: {
                            token: string;
                            nonce?: string | undefined;
                            accessToken?: string | undefined;
                            refreshToken?: string | undefined;
                            expiresAt?: number | undefined;
                            user?: {
                                name?: {
                                    firstName?: string | undefined;
                                    lastName?: string | undefined;
                                } | undefined;
                                email?: string | undefined;
                            } | undefined;
                        } | undefined;
                        scopes?: string[] | undefined;
                        requestSignUp?: boolean | undefined;
                        loginHint?: string | undefined;
                        additionalData?: Record<string, any> | undefined;
                    };
                    returned: {
                        redirect: boolean;
                        token?: string | undefined;
                        url?: string | undefined;
                        user?: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image?: string | null | undefined | undefined;
                            username?: string | null | undefined;
                            displayUsername?: string | null | undefined;
                            banned: boolean | null | undefined;
                            role?: string | null | undefined;
                            banReason?: string | null | undefined;
                            banExpires?: Date | null | undefined;
                        } | undefined;
                    };
                };
                openapi: {
                    description: string;
                    operationId: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        description: string;
                                        properties: {
                                            token: {
                                                type: string;
                                            };
                                            user: {
                                                type: string;
                                                $ref: string;
                                            };
                                            url: {
                                                type: string;
                                            };
                                            redirect: {
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
            redirect: boolean;
            url: string;
        } | {
            redirect: boolean;
            token: string;
            url: undefined;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
                username?: string | null | undefined;
                displayUsername?: string | null | undefined;
                banned: boolean | null | undefined;
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            };
        }>;
        readonly callbackOAuth: import("better-call").StrictEndpoint<"/callback/:id", {
            method: ("GET" | "POST")[];
            operationId: string;
            body: import("zod").ZodOptional<import("zod").ZodObject<{
                code: import("zod").ZodOptional<import("zod").ZodString>;
                error: import("zod").ZodOptional<import("zod").ZodString>;
                device_id: import("zod").ZodOptional<import("zod").ZodString>;
                error_description: import("zod").ZodOptional<import("zod").ZodString>;
                state: import("zod").ZodOptional<import("zod").ZodString>;
                user: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            query: import("zod").ZodOptional<import("zod").ZodObject<{
                code: import("zod").ZodOptional<import("zod").ZodString>;
                error: import("zod").ZodOptional<import("zod").ZodString>;
                device_id: import("zod").ZodOptional<import("zod").ZodString>;
                error_description: import("zod").ZodOptional<import("zod").ZodString>;
                state: import("zod").ZodOptional<import("zod").ZodString>;
                user: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            metadata: {
                allowedMediaTypes: string[];
                scope: "server";
            };
        }, never>;
        readonly getSession: import("better-call").StrictEndpoint<"/get-session", {
            method: ("GET" | "POST")[];
            operationId: string;
            query: import("zod").ZodOptional<import("zod").ZodObject<{
                disableCookieCache: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
                disableRefresh: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
            }, import("zod/v4/core").$strip>>;
            requireHeaders: true;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
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
                                        required: string[];
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
                ipAddress?: string | null | undefined | undefined;
                userAgent?: string | null | undefined | undefined;
                impersonatedBy?: string | null | undefined;
            };
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
                username?: string | null | undefined;
                displayUsername?: string | null | undefined;
                banned: boolean | null | undefined;
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            };
        } | null>;
        readonly signOut: import("better-call").StrictEndpoint<"/sign-out", {
            method: "POST";
            operationId: string;
            requireHeaders: true;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
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
        readonly signUpEmail: import("better-call").StrictEndpoint<"/sign-up/email", {
            method: "POST";
            operationId: string;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
            body: import("zod").ZodIntersection<import("zod").ZodObject<{
                name: import("zod").ZodString;
                email: import("zod").ZodEmail;
                password: import("zod").ZodString;
                image: import("zod").ZodOptional<import("zod").ZodString>;
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                rememberMe: import("zod").ZodOptional<import("zod").ZodBoolean>;
            }, import("zod/v4/core").$strip>, import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
            cloneRequest: true;
            metadata: {
                allowedMediaTypes: string[];
                $Infer: {
                    body: {
                        name: string;
                        email: string;
                        password: string;
                        image?: string | undefined;
                        callbackURL?: string | undefined;
                        rememberMe?: boolean | undefined;
                    } & {} & {
                        username?: string | null | undefined;
                        displayUsername?: string | null | undefined;
                    } & {} & {};
                    returned: {
                        token: string | null;
                        user: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image?: string | null | undefined | undefined;
                            username?: string | null | undefined;
                            displayUsername?: string | null | undefined;
                            banned: boolean | null | undefined;
                            role?: string | null | undefined;
                            banReason?: string | null | undefined;
                            banExpires?: Date | null | undefined;
                        };
                    };
                };
                openapi: {
                    operationId: string;
                    description: string;
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object";
                                    properties: {
                                        name: {
                                            type: string;
                                            description: string;
                                        };
                                        email: {
                                            type: string;
                                            description: string;
                                        };
                                        password: {
                                            type: string;
                                            description: string;
                                        };
                                        image: {
                                            type: string;
                                            description: string;
                                        };
                                        callbackURL: {
                                            type: string;
                                            description: string;
                                        };
                                        rememberMe: {
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
                                            token: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            user: {
                                                type: string;
                                                properties: {
                                                    id: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    email: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    image: {
                                                        type: string;
                                                        format: string;
                                                        nullable: boolean;
                                                        description: string;
                                                    };
                                                    emailVerified: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    createdAt: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                    updatedAt: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        "422": {
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
            token: null;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
                username?: string | null | undefined;
                displayUsername?: string | null | undefined;
                banned: boolean | null | undefined;
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            };
        } | {
            token: string;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
                username?: string | null | undefined;
                displayUsername?: string | null | undefined;
                banned: boolean | null | undefined;
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            };
        }>;
        readonly signInEmail: import("better-call").StrictEndpoint<"/sign-in/email", {
            method: "POST";
            operationId: string;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
            cloneRequest: true;
            body: import("zod").ZodObject<{
                email: import("zod").ZodString;
                password: import("zod").ZodString;
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                rememberMe: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodBoolean>>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                allowedMediaTypes: string[];
                $Infer: {
                    body: {
                        email: string;
                        password: string;
                        callbackURL?: string | undefined;
                        rememberMe?: boolean | undefined;
                    };
                    returned: {
                        redirect: boolean;
                        token: string;
                        url?: string | undefined;
                        user: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image?: string | null | undefined | undefined;
                            username?: string | null | undefined;
                            displayUsername?: string | null | undefined;
                            banned: boolean | null | undefined;
                            role?: string | null | undefined;
                            banReason?: string | null | undefined;
                            banExpires?: Date | null | undefined;
                        };
                    };
                };
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        description: string;
                                        properties: {
                                            redirect: {
                                                type: string;
                                                enum: boolean[];
                                            };
                                            token: {
                                                type: string;
                                                description: string;
                                            };
                                            url: {
                                                type: string;
                                                nullable: boolean;
                                            };
                                            user: {
                                                type: string;
                                                $ref: string;
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
            redirect: boolean;
            token: string;
            url?: string | undefined;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
                username?: string | null | undefined;
                displayUsername?: string | null | undefined;
                banned: boolean | null | undefined;
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            };
        }>;
        readonly resetPassword: import("better-call").StrictEndpoint<"/reset-password", {
            method: "POST";
            operationId: string;
            query: import("zod").ZodOptional<import("zod").ZodObject<{
                token: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            body: import("zod").ZodObject<{
                newPassword: import("zod").ZodString;
                token: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
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
        readonly verifyPassword: import("better-call").StrictEndpoint<"/verify-password", {
            method: "POST";
            body: import("zod").ZodObject<{
                password: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            metadata: {
                scope: "server";
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
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
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
        }, {
            status: boolean;
        }>;
        readonly verifyEmail: import("better-call").StrictEndpoint<"/verify-email", {
            method: "GET";
            operationId: string;
            query: import("zod").ZodObject<{
                token: import("zod").ZodString;
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
            metadata: {
                openapi: {
                    description: string;
                    parameters: ({
                        name: string;
                        in: "query";
                        description: string;
                        required: true;
                        schema: {
                            type: "string";
                        };
                    } | {
                        name: string;
                        in: "query";
                        description: string;
                        required: false;
                        schema: {
                            type: "string";
                        };
                    })[];
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            user: {
                                                type: string;
                                                $ref: string;
                                            };
                                            status: {
                                                type: string;
                                                description: string;
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
        }, void | {
            status: boolean;
        }>;
        readonly sendVerificationEmail: import("better-call").StrictEndpoint<"/send-verification-email", {
            method: "POST";
            operationId: string;
            cloneRequest: true;
            body: import("zod").ZodObject<{
                email: import("zod").ZodEmail;
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object";
                                    properties: {
                                        email: {
                                            type: string;
                                            description: string;
                                            example: string;
                                        };
                                        callbackURL: {
                                            type: string;
                                            description: string;
                                            example: string;
                                            nullable: boolean;
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
                                            status: {
                                                type: string;
                                                description: string;
                                                example: boolean;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        "400": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            message: {
                                                type: string;
                                                description: string;
                                                example: string;
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
        readonly changeEmail: import("better-call").StrictEndpoint<"/change-email", {
            method: "POST";
            body: import("zod").ZodObject<{
                newEmail: import("zod").ZodEmail;
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    operationId: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            user: {
                                                type: string;
                                                $ref: string;
                                            };
                                            status: {
                                                type: string;
                                                description: string;
                                            };
                                            message: {
                                                type: string;
                                                enum: string[];
                                                description: string;
                                                nullable: boolean;
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
            status: boolean;
        }>;
        readonly changePassword: import("better-call").StrictEndpoint<"/change-password", {
            method: "POST";
            operationId: string;
            body: import("zod").ZodObject<{
                newPassword: import("zod").ZodString;
                currentPassword: import("zod").ZodString;
                revokeOtherSessions: import("zod").ZodOptional<import("zod").ZodBoolean>;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            token: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            user: {
                                                type: string;
                                                properties: {
                                                    id: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    email: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    image: {
                                                        type: string;
                                                        format: string;
                                                        nullable: boolean;
                                                        description: string;
                                                    };
                                                    emailVerified: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    createdAt: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                    updatedAt: {
                                                        type: string;
                                                        format: string;
                                                        description: string;
                                                    };
                                                };
                                                required: string[];
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
            token: string | null;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        }>;
        readonly setPassword: import("better-call").StrictEndpoint<string, {
            method: "POST";
            body: import("zod").ZodObject<{
                newPassword: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
        }, {
            status: boolean;
        }>;
        readonly updateSession: import("better-call").StrictEndpoint<"/update-session", {
            method: "POST";
            operationId: string;
            body: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                $Infer: {
                    body: Partial<import("better-auth").AdditionalSessionFieldsInput<{
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
                };
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            session: {
                                                type: string;
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
        }>;
        readonly updateUser: import("better-call").StrictEndpoint<"/update-user", {
            method: "POST";
            operationId: string;
            body: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                $Infer: {
                    body: Partial<import("better-auth").AdditionalUserFieldsInput<{
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
                    }>> & {
                        name?: string | undefined;
                        image?: string | undefined | null;
                    };
                };
                openapi: {
                    operationId: string;
                    description: string;
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object";
                                    properties: {
                                        name: {
                                            type: string;
                                            description: string;
                                        };
                                        image: {
                                            type: string;
                                            description: string;
                                            nullable: boolean;
                                        };
                                    };
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
                                            user: {
                                                type: string;
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
            status: boolean;
        }>;
        readonly deleteUser: import("better-call").StrictEndpoint<"/delete-user", {
            method: "POST";
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            body: import("zod").ZodObject<{
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                password: import("zod").ZodOptional<import("zod").ZodString>;
                token: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object";
                                    properties: {
                                        callbackURL: {
                                            type: string;
                                            description: string;
                                        };
                                        password: {
                                            type: string;
                                            description: string;
                                        };
                                        token: {
                                            type: string;
                                            description: string;
                                        };
                                    };
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
                                            success: {
                                                type: string;
                                                description: string;
                                            };
                                            message: {
                                                type: string;
                                                enum: string[];
                                                description: string;
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
            success: boolean;
            message: string;
        }>;
        readonly requestPasswordReset: import("better-call").StrictEndpoint<"/request-password-reset", {
            method: "POST";
            body: import("zod").ZodObject<{
                email: import("zod").ZodEmail;
                redirectTo: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            status: {
                                                type: string;
                                            };
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
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
        }, {
            status: boolean;
            message: string;
        }>;
        readonly requestPasswordResetCallback: import("better-call").StrictEndpoint<"/reset-password/:token", {
            method: "GET";
            operationId: string;
            query: import("zod").ZodObject<{
                callbackURL: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    parameters: ({
                        name: string;
                        in: "path";
                        required: true;
                        description: string;
                        schema: {
                            type: "string";
                        };
                    } | {
                        name: string;
                        in: "query";
                        required: true;
                        description: string;
                        schema: {
                            type: "string";
                        };
                    })[];
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            token: {
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
        }, never>;
        readonly listSessions: import("better-call").StrictEndpoint<"/list-sessions", {
            method: "GET";
            operationId: string;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            requireHeaders: true;
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array";
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
        }, import("better-auth").Prettify<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined | undefined;
            userAgent?: string | null | undefined | undefined;
            impersonatedBy?: string | null | undefined;
        }>[]>;
        readonly revokeSession: import("better-call").StrictEndpoint<"/revoke-session", {
            method: "POST";
            body: import("zod").ZodObject<{
                token: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            requireHeaders: true;
            metadata: {
                openapi: {
                    description: string;
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object";
                                    properties: {
                                        token: {
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
                                            status: {
                                                type: string;
                                                description: string;
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
            status: boolean;
        }>;
        readonly revokeSessions: import("better-call").StrictEndpoint<"/revoke-sessions", {
            method: "POST";
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            requireHeaders: true;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            status: {
                                                type: string;
                                                description: string;
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
            status: boolean;
        }>;
        readonly revokeOtherSessions: import("better-call").StrictEndpoint<"/revoke-other-sessions", {
            method: "POST";
            requireHeaders: true;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            status: {
                                                type: string;
                                                description: string;
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
            status: boolean;
        }>;
        readonly linkSocialAccount: import("better-call").StrictEndpoint<"/link-social", {
            method: "POST";
            requireHeaders: true;
            body: import("zod").ZodObject<{
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                provider: import("zod").ZodType<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown, import("zod/v4/core").$ZodTypeInternals<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown>>;
                idToken: import("zod").ZodOptional<import("zod").ZodObject<{
                    token: import("zod").ZodString;
                    nonce: import("zod").ZodOptional<import("zod").ZodString>;
                    accessToken: import("zod").ZodOptional<import("zod").ZodString>;
                    refreshToken: import("zod").ZodOptional<import("zod").ZodString>;
                    scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                }, import("zod/v4/core").$strip>>;
                requestSignUp: import("zod").ZodOptional<import("zod").ZodBoolean>;
                scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                errorCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
                disableRedirect: import("zod").ZodOptional<import("zod").ZodBoolean>;
                additionalData: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    description: string;
                    operationId: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            url: {
                                                type: string;
                                                description: string;
                                            };
                                            redirect: {
                                                type: string;
                                                description: string;
                                            };
                                            status: {
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
            url: string;
            redirect: boolean;
        }>;
        readonly listUserAccounts: import("better-call").StrictEndpoint<"/list-accounts", {
            method: "GET";
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array";
                                        items: {
                                            type: string;
                                            properties: {
                                                id: {
                                                    type: string;
                                                };
                                                providerId: {
                                                    type: string;
                                                };
                                                createdAt: {
                                                    type: string;
                                                    format: string;
                                                };
                                                updatedAt: {
                                                    type: string;
                                                    format: string;
                                                };
                                                accountId: {
                                                    type: string;
                                                };
                                                userId: {
                                                    type: string;
                                                };
                                                scopes: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                    };
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
            };
        }, {
            scopes: string[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            providerId: string;
            accountId: string;
        }[]>;
        readonly deleteUserCallback: import("better-call").StrictEndpoint<"/delete-user/callback", {
            method: "GET";
            query: import("zod").ZodObject<{
                token: import("zod").ZodString;
                callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            success: {
                                                type: string;
                                                description: string;
                                            };
                                            message: {
                                                type: string;
                                                enum: string[];
                                                description: string;
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
            success: boolean;
            message: string;
        }>;
        readonly unlinkAccount: import("better-call").StrictEndpoint<"/unlink-account", {
            method: "POST";
            body: import("zod").ZodObject<{
                providerId: import("zod").ZodString;
                accountId: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
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
        readonly refreshToken: import("better-call").StrictEndpoint<"/refresh-token", {
            method: "POST";
            body: import("zod").ZodObject<{
                providerId: import("zod").ZodString;
                accountId: import("zod").ZodOptional<import("zod").ZodString>;
                userId: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        200: {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            tokenType: {
                                                type: string;
                                            };
                                            idToken: {
                                                type: string;
                                            };
                                            accessToken: {
                                                type: string;
                                            };
                                            refreshToken: {
                                                type: string;
                                            };
                                            accessTokenExpiresAt: {
                                                type: string;
                                                format: string;
                                            };
                                            refreshTokenExpiresAt: {
                                                type: string;
                                                format: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        400: {
                            description: string;
                        };
                    };
                };
            };
        }, {
            accessToken: string | undefined;
            refreshToken: string;
            accessTokenExpiresAt: Date | undefined;
            refreshTokenExpiresAt: Date | null | undefined;
            scope: string | null | undefined;
            idToken: string | null | undefined;
            providerId: string;
            accountId: string;
        }>;
        readonly getAccessToken: import("better-call").StrictEndpoint<"/get-access-token", {
            method: "POST";
            body: import("zod").ZodObject<{
                providerId: import("zod").ZodString;
                accountId: import("zod").ZodOptional<import("zod").ZodString>;
                userId: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        200: {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            tokenType: {
                                                type: string;
                                            };
                                            idToken: {
                                                type: string;
                                            };
                                            accessToken: {
                                                type: string;
                                            };
                                            accessTokenExpiresAt: {
                                                type: string;
                                                format: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        400: {
                            description: string;
                        };
                    };
                };
            };
        }, {
            accessToken: string;
            accessTokenExpiresAt: Date | undefined;
            scopes: string[];
            idToken: string | undefined;
        }>;
        readonly accountInfo: import("better-call").StrictEndpoint<"/account-info", {
            method: "GET";
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            user: {
                                                type: string;
                                                properties: {
                                                    id: {
                                                        type: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                    };
                                                    email: {
                                                        type: string;
                                                    };
                                                    image: {
                                                        type: string;
                                                    };
                                                    emailVerified: {
                                                        type: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                            data: {
                                                type: string;
                                                properties: {};
                                                additionalProperties: boolean;
                                            };
                                        };
                                        required: string[];
                                        additionalProperties: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            query: import("zod").ZodOptional<import("zod").ZodObject<{
                accountId: import("zod").ZodOptional<import("zod").ZodString>;
                providerId: import("zod").ZodOptional<import("zod").ZodString>;
                userId: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
        }, {
            user: import("better-auth").OAuth2UserInfo;
            data: Record<string, any>;
        } | null>;
    } & {
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
    } & {
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
    }>>>;
    readonly instance: import("better-auth").Auth<{
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
    }>;
}>;
declare class AuthP extends AuthP_base {
}
export declare const AuthPLive: Layer.Layer<AuthP, never, never>;
declare const p6: Effect.Effect<{
    viaProxy: {
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined | undefined;
            userAgent?: string | null | undefined | undefined;
            impersonatedBy?: string | null | undefined;
        };
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            username?: string | null | undefined;
            displayUsername?: string | null | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    } | null;
    viaRaw: Response;
}, BetterAuthApiError, AuthP>;
type P6Proxy = Effect.Success<typeof p6>['viaProxy'];
export declare const exports_: {
    p1: Effect.Effect<{
        users: import("better-auth/plugins/admin").UserWithRole[];
        total: number;
    }, BetterAuthApiError, AuthP>;
    p2: Effect.Effect<{
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
    }, BetterAuthApiError, AuthP>;
    p3: Effect.Effect<{
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
    }, BetterAuthApiError, AuthP>;
    p4: any;
    p5: Effect.Effect<string, BetterAuthApiError, AuthP>;
    p6: Effect.Effect<{
        viaProxy: {
            session: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined | undefined;
                userAgent?: string | null | undefined | undefined;
                impersonatedBy?: string | null | undefined;
            };
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
                username?: string | null | undefined;
                displayUsername?: string | null | undefined;
                banned: boolean | null | undefined;
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            };
        } | null;
        viaRaw: Response;
    }, BetterAuthApiError, AuthP>;
    _p1Error: true;
    _p6RawIsResponse: true;
};
export type { P6Proxy };
