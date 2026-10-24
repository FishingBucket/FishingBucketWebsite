<script module lang="ts">
    import type { Component } from 'svelte';

    export type Button =
        | {
              type: 'button';
              label: string;
              icon: Component;
              onclick: () => void;
              subtype?: 'x-button';
          }
        | {
              type: 'a';
              label: string;
              icon: Component;
              href: string;
          };
</script>

<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    let {
        buttons,
        value = $bindable(),
        ...input_attr
    }: HTMLInputAttributes & {
        value: string;
        buttons: Button[];
    } = $props();
</script>

<div class="buttoned-input-holder">
    <input style:padding-right={`${1.5 + buttons.length}em`} {...input_attr} bind:value />
    <!-- eslint-disable-next-line svelte/require-each-key -->
    {#each buttons as button, i}
        {#if button.type == 'button'}
            <button
                class:x-button={button.subtype == 'x-button'}
                class:input-button={true}
                aria-label={button.label}
                onclick={button.onclick}
                style:right={`${0.75 + i}em`}
            >
                <button.icon></button.icon>
            </button>
        {:else}
            <a
                href={button.href}
                target="_blank"
                rel="external"
                class:input-button={true}
                aria-label={button.label}
                style:right={`${0.75 + i}em`}
            >
                <button.icon></button.icon>
            </a>
        {/if}
    {/each}
</div>

<style>
    .buttoned-input-holder {
        flex-grow: 1;
        position: relative;
        width: auto;
    }

    .buttoned-input-holder input {
        width: 100%;
        position: relative;
        top: 0;
        left: 0;
    }

    .input-button {
        background-color: transparent;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        padding: 0;
        margin: 0;
        height: 1.5em;
        aspect-ratio: 1;
    }

    .x-button {
        color: var(--accent-danger);
    }
</style>
