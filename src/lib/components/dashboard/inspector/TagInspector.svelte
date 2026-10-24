<script lang="ts">
    import type { ProxyTag } from '$lib/models/effective';
    import { EditProxyTagEdit, type Edits } from '$lib/models/edits';
    import FieldGroup from './FieldGroup.svelte';

    let {
        tag,
        edits,
    }: {
        tag: ProxyTag;
        edits: Edits;
    } = $props();

    function onblur() {
        edits.add_edit(new EditProxyTagEdit(tag));
    }
</script>

<div class="inspector">
    <div
        class="row"
        style="flex-grow: 1; display: flex; gap: 10px; flex-direction: column; position: relative;"
    >
        <h1 style="margin: 0;">{tag.name}</h1>
        <button
            style="position: absolute; top: 0; right: 0;"
            onclick={() => {
                navigator.clipboard.writeText(tag.id.toString());
            }}
        >
            Copy ID: <span class="monospace" style="font-size: 1em;">{tag.id}</span>
        </button>
    </div>
    <FieldGroup title="Basic Information">
        <div class="field">
            <label for="name">Name:</label>
            <input
                name="name"
                id="name"
                placeholder="Name"
                bind:value={tag.name}
                {onblur}
                class:error={!tag.name}
            />
        </div>
        <div class="field">
            <label for="marker">Marker:</label>
            <input name="marker" id="marker" placeholder="Marker" bind:value={tag.tag} {onblur} />
        </div>
        <div class="field">
            <p>Metadata:</p>
            <table>
                <thead>
                    <tr>
                        <th>Date Created</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td
                            >{new Intl.DateTimeFormat().format(
                                new Date(tag.creation_date * 1000),
                            )}</td
                        >
                    </tr>
                </tbody>
            </table>
        </div>
    </FieldGroup>
    <div class="vfield">
        <label for="description">Description:</label>
        <textarea
            name="description"
            id="description"
            placeholder="Description"
            bind:value={tag.description}
            {onblur}
        ></textarea>
    </div>
</div>

<style>
    p {
        margin: 2px 0;
    }

    .inspector {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .row {
        display: flex;
        flex-direction: row;
        gap: 5px;
    }

    .field {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }

    .vfield {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .field input {
        flex-grow: 1;
        width: 100%;
    }
</style>
