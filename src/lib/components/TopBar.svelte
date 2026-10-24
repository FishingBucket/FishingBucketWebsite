<script lang="ts">
    import { Menu } from '@lucide/svelte';
    import { get_user_avatar } from '$lib/user';
    import { resolve } from '$app/paths';
    import { fly } from 'svelte/transition';
    import DiscordIcon from '$lib/components/DiscordIcon.svelte';
    import FluxerIcon from '$lib/components/FluxerIcon.svelte';
    import { fade } from 'svelte/transition';
    import { ChevronDown, X } from '@lucide/svelte';
    import { onDestroy } from 'svelte';
    import { page } from '$app/state';
    import GitHubIcon from './GitHubIcon.svelte';
    import { CONFIG_PUBLIC } from '$lib/config';
    import { http } from '$lib/api.svelte';
    import { Routes } from '$lib/routes';
    import { has_session, session } from '$lib/session.svelte';

    let login_dropdown_open = $state(false);
    const fluxer_redirect_uri = `${CONFIG_PUBLIC.api_url}/auth/fluxer?redirect_uri=${encodeURI(page.url.origin + '/redirect/fluxer')}`;
    const discord_redirect_uri = `${CONFIG_PUBLIC.api_url}/auth/discord?redirect_uri=${encodeURI(page.url.origin + '/redirect/discord')}`;

    let expand_user_settings = $state(false);
    let menu_open = $state(false);

    async function logout() {
        await http.request<unknown>(Routes.AUTH.LOGOUT, {});
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('session_id');
        window.location.href = resolve('/');
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.login-dropdown')) {
            login_dropdown_open = false;
        }
        if (!target.closest('.user-menu')) {
            expand_user_settings = false;
        }
    }

    onDestroy(() => {
        if (typeof document !== 'undefined') {
            document.removeEventListener('click', handleClickOutside);
        }
    });
</script>

<nav>
    <div class="nav-container">
        <div class="desktop-nav-links">
            <div class="logo">
                <a href={resolve('/')} class="logo-link">{CONFIG_PUBLIC.name}</a>
            </div>
            {#if has_session()}
                <a href={resolve('/dashboard')} class="nav-link">Dashboard</a>
            {/if}
            <a href={resolve('/privacy')} class="nav-link">Privacy</a>
            <a href={resolve('/terms')} class="nav-link">Terms</a>
            <a href={resolve('/copyright')} class="nav-link">Copyright</a>
            <a href={resolve('/contact')} class="nav-link">Contact</a>
        </div>

        <div class="nav-actions">
            <div class="github">
                <a href={CONFIG_PUBLIC.github} target="_blank" rel="noopener noreferrer external">
                    <GitHubIcon></GitHubIcon>
                </a>
            </div>

            {#if has_session()}
                <div class="user-menu">
                    <button
                        class="user-info"
                        onclick={() => {
                            expand_user_settings = !expand_user_settings;
                        }}
                    >
                        <img src={get_user_avatar(160)} alt="User avatar" class="avatar" />
                        <span class="user-name">{session().user.user.global_name}</span>
                    </button>
                    {#if expand_user_settings}
                        <div
                            class="user-dropdown dropdown-menu"
                            transition:fly={{
                                duration: 200,
                                y: -10,
                            }}
                        >
                            <button class="dropdown-item" onclick={logout}>Logout</button>
                        </div>
                    {/if}
                </div>
            {:else}
                <div class="login-dropdown">
                    <button
                        class="login-button"
                        onclick={() => {
                            login_dropdown_open = !login_dropdown_open;
                        }}
                    >
                        Login
                        <ChevronDown></ChevronDown>
                    </button>
                    {#if login_dropdown_open}
                        <div
                            class="login-dropdown-menu dropdown-menu"
                            transition:fly={{
                                duration: 200,
                                y: -10,
                            }}
                        >
                            <a href={fluxer_redirect_uri} rel="external" class="dropdown-item">
                                <FluxerIcon></FluxerIcon> Fluxer
                            </a>
                            {#if 'discord' in CONFIG_PUBLIC && CONFIG_PUBLIC.discord}
                                <a href={discord_redirect_uri} rel="external" class="dropdown-item">
                                    <DiscordIcon></DiscordIcon> Discord
                                </a>
                            {/if}
                        </div>
                    {/if}
                </div>
            {/if}
        </div>

        <button
            class="hamburger"
            onclick={() => {
                menu_open = !menu_open;
            }}
            aria-label="Toggle menu"
        >
            {#if menu_open}
                <X></X>
            {:else}
                <Menu></Menu>
            {/if}
        </button>
    </div>
</nav>

{#if menu_open}
    <button
        class="mobile-nav-overlay"
        onclick={() => {
            menu_open = false;
        }}
        transition:fade={{ duration: 200 }}
        aria-label="Close menu"
    ></button>
    <nav class="mobile-nav" transition:fly={{ x: -300, duration: 200 }}>
        <div class="mobile-nav-content">
            <a
                href={resolve('/')}
                class="mobile-nav-link"
                onclick={() => {
                    menu_open = false;
                }}>Home</a
            >
            {#if has_session()}
                <a
                    href={resolve('/dashboard')}
                    class="mobile-nav-link"
                    onclick={() => {
                        menu_open = false;
                    }}>Dashboard</a
                >
            {/if}
            <a
                href={resolve('/privacy')}
                class="mobile-nav-link"
                onclick={() => {
                    menu_open = false;
                }}>Privacy</a
            >
            <a
                href={resolve('/terms')}
                class="mobile-nav-link"
                onclick={() => {
                    menu_open = false;
                }}>Terms</a
            >
            <a
                href={resolve('/copyright')}
                class="mobile-nav-link"
                onclick={() => {
                    menu_open = false;
                }}>Copyright</a
            >
            <a
                href={resolve('/contact')}
                class="mobile-nav-link"
                onclick={() => {
                    menu_open = false;
                }}>Contact</a
            >
            {#if !has_session()}
                <a
                    href={fluxer_redirect_uri}
                    rel="external"
                    class="mobile-nav-link"
                    onclick={() => {
                        menu_open = false;
                    }}
                >
                    <FluxerIcon></FluxerIcon> Login with Fluxer
                </a>
                {#if 'discord' in CONFIG_PUBLIC && CONFIG_PUBLIC.discord}
                    <a
                        href={discord_redirect_uri}
                        rel="external"
                        class="mobile-nav-link"
                        onclick={() => {
                            menu_open = false;
                        }}
                    >
                        <DiscordIcon></DiscordIcon> Login with Discord
                    </a>
                {/if}
            {/if}
        </div>
    </nav>
{/if}

<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background-color: var(--background-header-primary);
        border-bottom: 1px solid var(--border-color);
        z-index: 9999;
        backdrop-filter: blur(10px);
    }

    .nav-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 1rem 2rem;
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .logo {
        flex-shrink: 0;
    }

    .logo-link {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text-primary);
        text-decoration: none;
        letter-spacing: -0.02em;
    }

    .logo-link:hover {
        color: var(--accent-primary);
    }

    .desktop-nav-links {
        display: flex;
        gap: 2rem;
        flex-grow: 1;
        align-items: center;
    }

    .nav-link {
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.95rem;
        position: relative;
    }

    .nav-link:hover {
        color: var(--text-primary);
    }

    .nav-link::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 2px;
        background-color: var(--accent-primary);
    }

    .nav-link:hover::after {
        width: 100%;
    }

    .nav-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-shrink: 0;
    }

    .user-menu {
        position: relative;
        display: flex;
        align-items: center;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 1rem;
        background-color: var(--background-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        cursor: pointer;
    }

    .user-info:hover {
        background-color: var(--background-tertiary);
        border-color: var(--accent-primary);
    }

    .user-info .avatar {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
    }

    .user-name {
        font-weight: 500;
        color: var(--text-primary);
    }

    .user-dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        background-color: var(--background-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        min-width: 150px;
        overflow: hidden;
    }

    .dropdown-item {
        width: 100%;
        padding: 0.75rem 1rem;
        background: none;
        border: none;
        color: var(--text-primary);
        text-align: left;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        gap: 5px;
        align-items: center;
    }

    .dropdown-item:hover {
        background-color: var(--background-tertiary);
    }

    .login-dropdown {
        position: relative;
    }

    .login-button {
        background-color: var(--accent-primary);
        color: white;
        padding: 0.625rem 1.25rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .login-button:hover {
        background-color: var(--accent-secondary);
    }

    .login-dropdown-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        background-color: var(--background-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        min-width: 180px;
        overflow: hidden;
        z-index: 1000;
    }

    .login-dropdown-menu .dropdown-item {
        width: 100%;
        padding: 0.75rem 1rem;
        background: none;
        border: none;
        color: var(--text-primary);
        text-align: left;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
    }

    .dropdown-menu {
        right: 0;
    }

    .login-dropdown-menu .dropdown-item:hover {
        background-color: var(--background-tertiary);
    }

    .hamburger {
        display: none;
        background: none;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        color: var(--text-primary);
        margin-left: auto;
    }

    .hamburger:hover {
        color: var(--accent-primary);
    }

    .mobile-nav-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        border: none;
        padding: 0;
        cursor: pointer;
    }

    .mobile-nav {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 300px;
        background-color: var(--background-header-primary);
        border-left: 1px solid var(--border-color);
        z-index: 9999;
        display: flex;
        flex-direction: column;
    }

    .mobile-nav-content {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .mobile-nav-link {
        color: var(--text-primary);
        text-decoration: none;
        font-weight: 500;
        font-size: 1.1rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        display: flex;
        gap: 5px;
        align-items: center;
    }

    .mobile-nav-link:hover {
        background-color: var(--background-secondary);
    }

    @media (max-width: 1024px) {
        .desktop-nav-links {
            display: none;
        }

        .hamburger {
            display: flex;
        }

        .dropdown-menu {
            right: auto;
            left: 0;
        }
    }

    @media (max-width: 480px) {
        .nav-container {
            padding: 1rem;
        }

        .mobile-nav {
            width: 280px;
        }
    }
</style>
