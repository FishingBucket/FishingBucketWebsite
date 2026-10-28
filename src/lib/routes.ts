export interface RouteInfo {
    method: 'GET' | 'POST' | 'PUT';
    endpoint: string;
    require_auth: boolean;
}

function route(
    method: RouteInfo['method'],
    endpoint: string,
    require_auth: boolean = true,
): RouteInfo {
    return {
        method,
        endpoint,
        require_auth,
    };
}

export const Routes = {
    INFO_ME: route('GET', '/info/@me'),
    EDIT: route('POST', '/edit'),
    UPLOAD: route('POST', '/upload'),
    AUTH: {
        REDIRECT: (platform: string) => route('GET', `/auth/${platform}`, false),
        LOGIN: (platform: string) => route('POST', `/auth/${platform}/login`, false),
        LOGOUT: route('POST', '/auth/logout'),
        EXTEND: route('POST', '/auth/extend'),
    },
} as const;
