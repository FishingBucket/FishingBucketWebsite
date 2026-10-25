<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { resolve } from '$app/paths';
    import type { PageProps } from './$types';
    import { http, is_err } from '$lib/api.svelte';
    import { Routes } from '$lib/routes';
    import type { DiscordUser, FluxerUser, User } from '$lib/user';
    import { Session, set_session } from '$lib/session.svelte';
    import { CONFIG_PUBLIC } from '$lib/config';

    let { params }: PageProps = $props();

    let text = $state('');

    onMount(async () => {
        if (['fluxer', 'discord'].includes(params.platform)) {
            text = 'Logging in...';
            const code = page.url.searchParams.get('code');
            if (code == null) {
                text = 'Login canceled';
                window.location.assign(resolve('/'));
                return;
            }
            let redirect_url = page.url;
            redirect_url.searchParams.delete('code');
            redirect_url.searchParams.delete('iss'); // this is from discord for some reason
            const response = await http.request<{
                session_id: string;
                user: FluxerUser | DiscordUser;
                platform: 'fluxer' | 'discord';
                expires: number;
            }>(Routes.AUTH.LOGIN(params.platform), {
                code: code,
                redirect_uri: redirect_url.toString(),
            });
            if (is_err(response)) {
                text = `${response.code}: ${response.message}`;
                return;
            } else {
                text = 'Saving data...';
                const { session_id, user, platform, expires } = response.value;
                const session = new Session(session_id, expires, {
                    platform,
                    user,
                } as User);
                session.to_storage(localStorage);
                set_session(session);
                text = 'Redirecting...';
                window.location.assign(resolve('/'));
            }
        } else {
            text = `Error: unrecognized platform ${params.platform}`;
        }
    });
</script>

<svelte:head>
    <title>Authorization | {CONFIG_PUBLIC.name}</title>
</svelte:head>

<h1>{text}</h1>
