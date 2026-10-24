<script lang="ts">
    import { Cog } from '@lucide/svelte';
    import { resolve } from '$app/paths';
    import FluxerIcon from '$lib/components/FluxerIcon.svelte';
    import DiscordIcon from '$lib/components/DiscordIcon.svelte';
    import favicon from '$lib/assets/favicon.png';
    import { CONFIG_PUBLIC } from '$lib/config';
    import { http } from '$lib/api.svelte';
    import { slide } from 'svelte/transition';

    let features_visible = $state(false);
</script>

<svelte:head>
    <title>{CONFIG_PUBLIC.name} - Next-Generation Proxy Bot</title>
    <meta
        name="description"
        content={`${CONFIG_PUBLIC.name} is the next generation of proxy bots.`}
    />
    <meta name="keywords" content="tupperbox, pluralkit, fluxer, discord, bot, fishingbucket" />
</svelte:head>

<div class="homepage">
    <section class="hero cool-background">
        <div class="hero-content">
            <img src={favicon} alt={CONFIG_PUBLIC.name} class="hero-avatar" />
            <h1 class="hero-title">{CONFIG_PUBLIC.name}</h1>
            <div class="hero-buttons">
                <a
                    class="button primary-button fluxer"
                    href={CONFIG_PUBLIC.fluxer.invite}
                    rel="external"
                >
                    <FluxerIcon></FluxerIcon> Add to Fluxer
                </a>
                {#if 'discord' in CONFIG_PUBLIC && CONFIG_PUBLIC.discord}
                    <a
                        class="button secondary-button discord"
                        href={CONFIG_PUBLIC.discord.invite}
                        rel="external"
                    >
                        <DiscordIcon></DiscordIcon> Add to Discord
                    </a>
                {/if}
                {#if http.logged_in()}
                    <a class="button secondary-button" href={resolve('/dashboard')}>
                        <Cog></Cog> Dashboard
                    </a>
                {/if}
            </div>
        </div>
    </section>

    <section class="docs cool-background">
        <section class="docs-text">
            <h2>Documentation in Progress</h2>
            <p>Check in later!</p>
            <br />
            <button
                onclick={() => {
                    features_visible = !features_visible;
                }}>See outdated features list</button
            >
        </section>

        {#if features_visible}
            <section class="features" transition:slide>
                <div class="feature-grid">
                    <div class="feature-card">
                        <h3>Proxies</h3>
                        <p>
                            Proxies are faux profiles that can be used to send messages through, as
                            long as
                            {CONFIG_PUBLIC.name} has access to the channel, and you have permission to
                            use proxies in that channel. Proxies can be used via invoking its trigger,
                            which is essentially a pattern that {CONFIG_PUBLIC.name} tries to search for
                            in messages.
                        </p>
                    </div>

                    <div class="feature-card">
                        <h3>Proxy Features</h3>
                        <p>
                            {CONFIG_PUBLIC.name} proxies has a variety of features, including but not
                            limited to:
                        </p>
                        <ul>
                            <li>Changing the proxy's name or avatar</li>
                            <li>Add a nickname to the proxy</li>
                            <li>Organize proxies into proxy tags</li>
                            <li>Add and switch proxy forms instantly</li>
                            <li>Import from other services like PluralKit or Tupperbox</li>
                            <li>And more!</li>
                        </ul>
                    </div>

                    <div class="feature-card">
                        <h3>Proxied Messages</h3>
                        <p>
                            A proxied message is a message sent via a proxy. You can interact with a
                            proxied message in a variety of different ways:
                        </p>
                        <ul>
                            <li>React with ❌ to a message that you've sent to delete it</li>
                            <li>
                                React with ❓ to a proxy to show who sent it and the corresponding
                                proxy information
                            </li>
                            <li>React with 📝 to edit a message that you've sent</li>
                            <li>React with 🔔 to ping the person behind the proxied message</li>
                        </ul>
                    </div>

                    <div class="feature-card">
                        <h3>Autoproxy</h3>
                        <p>
                            Autoproxy is a setting to automatically send messages through a proxy.
                            If this setting is not off, every message you sent will be automatically
                            proxied. Autoproxy comes in three different modes: specific, latch, and
                            spotlight. You can autoproxy as a specific proxy, as the last used
                            proxy, or as the first spotlighted proxy. Starting a message with the
                            backslash symbol (\) will bypass autoproxy settings for that message,
                            while starting a message with two such symbols (\\) will autoproxy.
                        </p>
                    </div>

                    <div class="feature-card">
                        <h3>Trigger</h3>
                        <p>
                            A trigger is a specific way to let {CONFIG_PUBLIC.name} know when and how
                            to proxy a specific message. {CONFIG_PUBLIC.name} triggers are extremely powerful.
                            Triggers must contain a placeholder, indicated by the literal {'{}'} acting
                            as where the proxied text will go. Around the placeholder or placeholders,
                            prefixes, suffixes, and infixes can be placed.
                        </p>
                    </div>

                    <div class="feature-card">
                        <h3>Logging</h3>
                        <p>
                            Logging is a feature of {CONFIG_PUBLIC.name}. You can configure a
                            channel for {CONFIG_PUBLIC.name}
                            to log all proxy message actions to. A useful tool for moderation.
                        </p>
                    </div>
                </div>
            </section>
        {/if}
    </section>

    <section class="cta cool-background">
        <h2>Ready to Get Started?</h2>
        <p>Be among the thousands of users.</p>
        <div class="cta-buttons">
            <a
                class="button primary-button fluxer"
                href={CONFIG_PUBLIC.fluxer.invite}
                rel="external"
            >
                <FluxerIcon></FluxerIcon> Add to Fluxer
            </a>
            {#if 'discord' in CONFIG_PUBLIC && CONFIG_PUBLIC.discord}
                <a
                    class="button secondary-button discord"
                    href={CONFIG_PUBLIC.discord.invite}
                    rel="external"
                >
                    <DiscordIcon></DiscordIcon> Add to Discord
                </a>
            {/if}
        </div>
    </section>
</div>

<style>
    .homepage {
        width: 100%;
    }

    .hero {
        text-align: center;
        padding: 4rem 0;
        border-radius: 16px;
        margin-bottom: 3rem;
    }

    .hero-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    .hero-avatar {
        width: 120px;
        height: 120px;
        border-radius: 24px;
    }

    .hero-title {
        font-size: 3.5rem;
        font-weight: 800;
        line-height: 1.1;
        margin: 0;
    }

    .hero-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .docs {
        padding: 1em;
        margin-bottom: 2em;
        border-radius: 16px;
        border: 1px solid var(--border-color);
    }

    .docs-text {
        text-align: center;
        margin-bottom: 1em;
    }

    .primary-button {
        background-color: var(--accent-primary);
        color: white;
        padding: 1rem 2rem;
        font-size: 1.1rem;
    }

    .primary-button:hover {
        background-color: var(--accent-secondary);
    }

    .secondary-button {
        color: var(--text-primary);
        padding: 1rem 2rem;
        font-size: 1.1rem;
    }

    .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 1.5rem;
    }

    .feature-card {
        background-color: var(--background-secondary);
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid var(--border-color);
    }

    .feature-card h3 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .feature-card p {
        color: var(--text-secondary);
        line-height: 1.5;
        margin: 0;
        font-size: 0.9rem;
    }

    .feature-card ul {
        margin: 0.5rem 0 0 0;
        padding-left: 1.25rem;
    }

    .feature-card li {
        color: var(--text-secondary);
        line-height: 1.5;
        margin-bottom: 0.25rem;
        font-size: 0.85rem;
    }

    .cool-background {
        background: linear-gradient(
            135deg,
            var(--background-secondary) 0%,
            var(--background-primary) 100%
        );
    }

    .cta {
        text-align: center;
        padding: 3rem 2rem;
        border-radius: 16px;
        margin-bottom: 2rem;
        border: 1px solid var(--border-color);
    }

    .cta h2 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 0.75rem;
    }

    .cta p {
        font-size: 1.1rem;
        color: var(--text-secondary);
        margin-bottom: 2rem;
    }

    .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .cta .button {
        background-color: var(--accent-primary);
        color: white;
        padding: 1rem 2rem;
        font-size: 1.1rem;
    }

    .cta .button:hover {
        background-color: var(--accent-secondary);
    }

    .cta .discord {
        background-color: var(--background-secondary);
        color: var(--text-primary);
    }

    .cta .discord:hover {
        background-color: var(--background-tertiary);
    }

    @media (max-width: 768px) {
        .hero-title {
            font-size: 2.5rem;
        }

        .hero-avatar {
            width: 100px;
            height: 100px;
        }

        .cta h2 {
            font-size: 2rem;
        }

        .cta p {
            font-size: 1rem;
        }
    }
</style>
