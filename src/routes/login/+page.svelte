<script lang="ts">
    import { page } from '$app/state';
    import DiscordIcon from '$lib/components/DiscordIcon.svelte';
    import FluxerIcon from '$lib/components/FluxerIcon.svelte';
    import { CONFIG_PUBLIC } from '$lib/config';

    const fluxer_redirect_uri = `${CONFIG_PUBLIC.api_url}/auth/fluxer?redirect_uri=${encodeURI(page.url.origin + '/redirect/fluxer')}`;
    const discord_redirect_uri = `${CONFIG_PUBLIC.api_url}/auth/discord?redirect_uri=${encodeURI(page.url.origin + '/redirect/discord')}`;
</script>

<svelte:head>
    <title>Login | {CONFIG_PUBLIC.name}</title>
</svelte:head>

<div class="login-page">
    <div class="login-container">
        <h1>Login</h1>
        <h2>Login with:</h2>
        <div class="login-buttons">
            <a href={fluxer_redirect_uri} rel="external" class="login-button fluxer">
                <FluxerIcon></FluxerIcon> Fluxer
            </a>
            {#if 'discord' in CONFIG_PUBLIC && CONFIG_PUBLIC.discord}
                <a href={discord_redirect_uri} rel="external" class="login-button discord">
                    <DiscordIcon></DiscordIcon> Discord
                </a>
            {/if}
        </div>
    </div>
</div>

<style>
    .login-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100%;
        padding: 2rem;
    }

    .login-container {
        text-align: center;
        max-width: 500px;
        width: 100%;
    }

    .login-container h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .login-container h2 {
        font-size: 1.25rem;
        color: var(--text-secondary);
        margin-bottom: 2rem;
    }

    .login-buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
    }

    .login-button {
        padding: 1rem 2rem;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        font-size: 1.1rem;
        font-weight: 600;
        width: 100%;
        max-width: 300px;
    }

    .fluxer {
        background-color: var(--accent-primary);
        color: white;
    }

    .fluxer:hover {
        background-color: var(--accent-secondary);
    }

    .discord {
        background-color: #5865f2;
        color: white;
    }

    .discord:hover {
        background-color: #4752c4;
    }

    @media (max-width: 768px) {
        .login-container h1 {
            font-size: 2rem;
        }

        .login-button {
            max-width: 100%;
        }
    }
</style>
