export type User =
    { platform: 'fluxer'; user: FluxerUser } | { platform: 'discord'; user: DiscordUser };

export interface FluxerUser {
    id: string;
    avatar: string | undefined;
    username: string;
    discriminator: string;
    global_name: string;
}

export interface DiscordUser {
    id: string;
    avatar: string | undefined;
    username: string;
    global_name: string;
}

export function get_user(): User | null {
    if (window) {
        const user_unparsed = window.localStorage.getItem('user');
        const platform = window.localStorage.getItem('platform');
        if (user_unparsed == null || platform == null || !['discord', 'fluxer'].includes(platform))
            return null;
        return {
            platform: platform as 'fluxer' | 'discord',
            user: JSON.parse(user_unparsed),
        };
    }
    return null;
}

export function get_user_avatar(size: number): string | null {
    const user = get_user();
    if (user) {
        if (user.platform == 'fluxer') {
            if (user.user.avatar)
                return `https://fluxerusercontent.com/avatars/${user.user.id}/${user.user.avatar}.webp?size=${size}`;
            else {
                const id = BigInt(user.user.id);
                return `https://fluxerstatic.com/avatars/${(id % 6n).toString()}.png`;
            }
        } else if (user.platform == 'discord') {
            if (user.user.avatar)
                return `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.webp?size=${size}?animated=true`;
            else {
                const id = BigInt(user.user.id);
                return `https://cdn.discordapp.com/embed/avatars/${((id >> 22n) % 6n).toString()}.webp?size=${size}`;
            }
        }
    }
    return null;
}
