<script lang="ts">
    import {
        type ID,
        type ProxyTag,
        type Proxy,
        type UserInformation,
        proxy_get_effective_avatar_url,
        NullID,
    } from '$lib/models/effective';
    import type { Target } from './DashBoard.svelte';

    let {
        proxy,
        user_data,
        get_tag,
        onclick,
        current_target,
    }: {
        proxy: Proxy;
        user_data: UserInformation;
        get_tag: (tag: ID) => ProxyTag;
        onclick: (proxy: Proxy) => void;
        current_target: Target;
    } = $props();

    let applied_tags = $derived(
        user_data.relationships.find((r) => r.proxy.equals(proxy.id)) || {
            proxy: proxy.id,
            tags: [],
        },
    );
</script>

<button
    class="proxy-item"
    aria-label={proxy.effective_name}
    onclick={() => onclick(proxy)}
    class:selected={current_target.type == 'proxy' && current_target.data.id.equals(proxy.id)}
>
    <img src={proxy_get_effective_avatar_url(proxy)} alt="proxy avatar" class="avatar" />
    <div class="proxy-info">
        <h2>{proxy.effective_name}</h2>
        <h2 class="id monospace">{proxy.id}</h2>
        <div class="tags-list">
            <!-- eslint-disable svelte/require-each-key -->
            {#each applied_tags.tags as tag}
                {#if !(tag instanceof NullID)}
                    <span class="tag">{get_tag(tag).name}</span>
                {/if}
            {/each}
        </div>
    </div>
</button>

<style>
    .proxy-item {
        width: 100%;
        background: var(--background-secondary-alt);
        display: flex;
        justify-content: left;
        padding: 10px;
        gap: 10px;
        transition: ease 0.5s background;
    }

    .selected {
        background: var(--background-tertiary);
    }

    .avatar {
        aspect-ratio: 1;
        height: 3em;
    }

    .proxy-info {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
        position: relative;
        flex-grow: 1;
    }

    .proxy-info h2 {
        font-size: 1em;
        margin: 0;
    }

    .id {
        position: absolute;
        top: 0;
        right: 0;
    }

    .tags-list {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
    }

    .tag {
        padding: 2px 5px;
        background: var(--background-tertiary);
        border-radius: 5px;
        border-color: var(--background-primary);
        border-width: 2px;
        border-style: solid;
        flex: 0 0 auto;
    }
</style>
