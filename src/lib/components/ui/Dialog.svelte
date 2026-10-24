<script module lang="ts">
    export enum Button {
        OK,
        CANCEL,
        DELETE,
        CONFIRM,
        CLEAR,
        RESET,
    }

    export enum Level {
        INFO,
        WARNING,
        CAUTION,
        IMPORTANT,
    }
</script>

<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        title,
        level,
        buttons,
        open = $bindable(),
        children,
    }: {
        title: string;
        level: Level;
        buttons: [Button, (self: HTMLDialogElement, close: () => void) => void][];
        open: () => void;
        children: Snippet;
    } = $props();

    let self: HTMLDialogElement = $state()!;
    let opened = $state(false);

    open = () => {
        opened = true;
        self.showModal();
    };

    function close() {
        self.close();
        opened = false;
    }
</script>

<dialog
    bind:this={self}
    oncancel={() => {
        for (let [button, cb] of buttons) {
            if (button == Button.CANCEL) {
                cb(self, close);
            }
        }
    }}
    style:border-color={(() => {
        switch (level) {
            case Level.INFO:
                return 'var(--accent-info)';
            case Level.WARNING:
                return 'var(--accent-warning)';
            case Level.CAUTION:
                return 'var(--accent-danger)';
            case Level.IMPORTANT:
                return 'var(--accent-purple)';
        }
    })()}
    closedby="any"
>
    {#if opened}
        <div class="inner">
            <div
                class="padded"
                style="background: var(--background-secondary-alt); border-radius: 0 0 10px 10px;"
            >
                <h1 style="margin: 0;">{title}</h1>
            </div>
            <div class="padded" style="flex-grow: 1;">
                {@render children()}
            </div>
            <div class="buttons">
                {#each buttons as [button, cb], index (index)}
                    <!-- svelte-ignore a11y_autofocus -->
                    <button
                        class:info={button == Button.CANCEL}
                        class:primary={button == Button.CONFIRM || button == Button.OK}
                        class:danger={button == Button.DELETE || button == Button.RESET}
                        class:caution={button == Button.CLEAR}
                        onclick={() => cb(self, close)}
                        autofocus={index == 0}
                    >
                        {#if button == Button.CANCEL}
                            Cancel
                        {:else if button == Button.CONFIRM}
                            Confirm
                        {:else if button == Button.DELETE}
                            Delete
                        {:else if button == Button.OK}
                            Ok
                        {:else if button == Button.CLEAR}
                            Clear
                        {:else if button == Button.RESET}
                            Reset
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</dialog>

<style>
    .inner {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: inherit;
    }

    .buttons {
        justify-content: right;
        display: flex;
        gap: 10px;
        padding-bottom: 16px;
        padding-right: 16px;
    }

    .caution {
        background: var(--accent-warning);
    }

    .caution:hover {
        background: var(--accent-warning-secondary);
    }

    .info {
        background: var(--accent-info);
    }

    .info:hover {
        background: var(--accent-info-secondary);
    }

    .primary {
        background: var(--accent-primary);
    }

    .primary:hover {
        background: var(--accent-secondary);
    }

    .danger {
        background: var(--accent-danger);
    }

    .danger:hover {
        background: var(--accent-danger-secondary);
    }
</style>
