<script lang="ts">
    import type { ProxyTag } from '$lib/models/effective';
    import type { Target } from './DashBoard.svelte';

    let {
        tag,
        onclick,
        current_target,
    }: {
        tag: ProxyTag;
        onclick: (tag: ProxyTag) => void;
        current_target: Target;
    } = $props();
</script>

<button
    class="tag-item"
    aria-label={tag.name}
    onclick={() => onclick(tag)}
    class:selected={current_target.type == 'tag' && current_target.data.id.equals(tag.id)}
>
    <h2>{tag.name}</h2>
    <h2 class="id monospace">{tag.id}</h2>
</button>

<style>
    .tag-item {
        width: 100%;
        background: var(--background-secondary-alt);
        justify-content: left;
        padding: 10px;
        transition: ease 0.5s background;
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
        position: relative;
        flex-grow: 1;
    }

    .selected {
        background: var(--background-tertiary);
    }

    .tag-item h2 {
        font-size: 1em;
        margin: 0;
    }

    .id {
        position: absolute;
        top: 10px;
        right: 10px;
    }
</style>
