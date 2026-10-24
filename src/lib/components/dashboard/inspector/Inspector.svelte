<script lang="ts">
    import { CircleX, Trash2 } from '@lucide/svelte';
    import type { Target } from '../DashBoard.svelte';
    import ProxyInspector from './ProxyInspector.svelte';
    import TagInspector from './TagInspector.svelte';
    import Dialog, { Button, Level } from '$lib/components/ui/Dialog.svelte';
    import type { Edits } from '$lib/models/edits';
    import type { Proxy, ProxyTag, UserInformation } from '$lib/models/effective';

    let {
        current_target = $bindable(),
        target,
        edits,
        delete_proxy,
        delete_tag,
        user_data = $bindable(),
    }: {
        current_target: Target;
        target: (target: Target) => void;
        edits: Edits;
        delete_proxy: (proxy: Proxy) => void;
        delete_tag: (tag: ProxyTag) => void;
        user_data: UserInformation;
    } = $props();

    function delete_current() {
        if (current_target.type == 'proxy') {
            delete_proxy(current_target.data);
        } else if (current_target.type == 'tag') {
            delete_tag(current_target.data);
        }
    }

    function confirm_delete(_: HTMLDialogElement, close: () => void) {
        close();
        delete_current();
        target({
            type: null,
            data: undefined,
        });
    }

    let delete_dialogs: {
        proxy: () => void;
        tag: () => void;
    } = $state({
        proxy: undefined!,
        tag: undefined!,
    });
</script>

<Dialog
    title="Are you sure?"
    level={Level.CAUTION}
    buttons={[
        [Button.CANCEL, (_, close) => close()],
        [Button.DELETE, confirm_delete],
    ]}
    bind:open={delete_dialogs.proxy}
>
    <p>
        Are you sure you want to delete this proxy? This action is <strong>irreversible</strong>!
    </p>
</Dialog>

<Dialog
    title="Are you sure?"
    level={Level.CAUTION}
    buttons={[
        [Button.CANCEL, (_, close) => close()],
        [Button.DELETE, confirm_delete],
    ]}
    bind:open={delete_dialogs.tag}
>
    <p>
        Are you sure you want to delete this tag? This deletion will cascade into all proxies with
        this tag! This action is <strong>irreversible</strong>!
    </p>
</Dialog>

<div class="inspector">
    {#if current_target.type}
        <div style="display: flex; flex-direction: column;">
            <p class="top-bar">
                {#if current_target.type == 'tag'}
                    Tag
                {:else if current_target.type == 'proxy'}
                    Proxy
                {/if}
                <button
                    class="neutered-button"
                    style="position: absolute; top: 5px; left: 5px;"
                    onclick={() => {
                        target({
                            type: null,
                            data: undefined,
                        });
                    }}
                    aria-label="close inspector"
                >
                    <CircleX></CircleX>
                </button>
                <button
                    class="neutered-button"
                    style="position: absolute; top: 5px; right: 5px; color: var(--accent-danger);"
                    onclick={() => {
                        if (current_target.type == 'proxy') {
                            delete_dialogs.proxy();
                        } else {
                            delete_dialogs.tag();
                        }
                    }}
                    aria-label="delete item"
                >
                    <Trash2></Trash2>
                </button>
            </p>
            <div style="padding: 10px;">
                {#if current_target.type == 'tag'}
                    <TagInspector tag={current_target.data} {edits}></TagInspector>
                {:else if current_target.type == 'proxy'}
                    <ProxyInspector bind:proxy={current_target.data} {edits} bind:user_data {target}
                    ></ProxyInspector>
                {/if}
            </div>
        </div>
    {:else}
        <p class="top-bar">Select an item on the left to inspect and edit it.</p>
    {/if}
</div>

<style>
    .inspector {
        background: var(--background-secondary-alt);
        border-radius: 8px;
        width: 100%;
        height: 100%;
    }

    .top-bar {
        flex-grow: 1;
        text-align: center;
        margin: 0;
        position: relative;
        background: var(--background-tertiary);
        padding: 5px;
        border-radius: 8px 8px 0 0;
    }
</style>
