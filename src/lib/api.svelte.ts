import { CONFIG_PUBLIC } from './config';
import { Routes, type RouteInfo } from './routes';
import { session } from './session.svelte';

interface ApiError {
    code: number;
    message: string;
}

interface ApiValue<T> {
    value: T;
}

export type ApiResponse<T> = ApiError | ApiValue<T>;

export function is_ok<T>(response: ApiResponse<T>): response is ApiValue<T> {
    return 'value' in response;
}

export function is_err<T>(response: ApiResponse<T>): response is ApiError {
    return !is_ok(response);
}

export function throw_err<T>(response: ApiResponse<T>): T {
    if (is_ok(response)) {
        return response.value;
    }
    throw new Error();
}

export class ApiClient {
    seconds_until_expiration(): number {
        try {
            return session().expires - Date.now() / 1000;
        } catch {
            return 0;
        }
    }

    logged_in(): boolean {
        try {
            session();
            return this.seconds_until_expiration() > 0;
        } catch {
            return false;
        }
    }

    async request<T>(route: RouteInfo, body?: unknown): Promise<ApiResponse<T>> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (route.require_auth) {
            try {
                headers['Authorization'] = session().session_id;
            } catch {
                return {
                    code: 403,
                    message: 'Unauthenticated',
                };
            }
        }

        const init: RequestInit = {
            headers,
            method: route.method,
        };

        if (route.method == 'POST' && body) {
            init.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(CONFIG_PUBLIC.api_url + route.endpoint, init);
            if (response.status == 200) {
                return {
                    value: (await response.json()) as T,
                };
            } else if (400 <= response.status) {
                return {
                    code: response.status,
                    message: response.statusText,
                };
            } else {
                return {
                    value: undefined as T,
                };
            }
        } catch (e) {
            console.error(e);
            return {
                code: 400,
                message: 'Cannot connect to API.',
            };
        }
    }

    async refresh_token() {
        try {
            session();
        } catch {
            return;
        }

        const response = await this.request<{
            expires: number;
        }>(Routes.AUTH.EXTEND, undefined);
        if (is_ok(response)) {
            session().expires = response.value.expires;
        }
    }
}

export const http = new ApiClient();
