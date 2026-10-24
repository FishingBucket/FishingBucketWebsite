<script lang="ts">
    import {
        SortIDType,
        SortOrder,
        SortStringType,
        type SortID,
        type SortKind,
        type SortString,
        type SortType,
    } from '$lib/query/sort';

    let {
        sort_settings = $bindable(),
        fields,
    }: {
        sort_settings: SortType & { type: string };
        fields: { [key: string]: [string, SortKind] };
    } = $props();

    let kind = $derived(fields[sort_settings.type][1]);
</script>

<div class="sort">
    <label for="sort">Sort By:</label>
    <select
        id="sort"
        name="sort"
        bind:value={
            () => sort_settings.type,
            (v) => {
                sort_settings.type = v;
                const kind = fields[v][1];
                switch (kind) {
                    case 'string': {
                        (sort_settings as SortString).sort_string = SortStringType.Alphabet;
                        break;
                    }
                    case 'array':
                    case 'number': {
                        break;
                    }
                    case 'id': {
                        (sort_settings as SortID).sort_id = SortIDType.EphemeralFirst;
                        break;
                    }
                    default: {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const _exhaustive: never = kind;
                    }
                }
            }
        }
    >
        {#each Object.entries(fields) as [key, [name]], index (index)}
            <option value={key}>{name}</option>
        {/each}
    </select>

    <label for="sort order">
        {#if kind == 'array'}
            Order Length By:
        {:else}
            Order By:
        {/if}
    </label>
    <select id="sort-order" name="sort order" bind:value={sort_settings.order}>
        <option value={SortOrder.Ascending}>Ascending</option>
        <option value={SortOrder.Descending}>Descending</option>
    </select>

    {#if kind == 'string'}
        <label for="count by">Count By:</label>
        <select
            id="count-by"
            name="count by"
            bind:value={(sort_settings as SortString).sort_string}
        >
            <option value={SortStringType.Alphabet}>Alphabetically</option>
            <option value={SortStringType.Length}>Length-wise</option>
        </select>
    {:else if kind == 'id'}
        <label for="ephemerals">Place Unsaved IDs:</label>
        <select id="ephemerals" name="ephemerals" bind:value={(sort_settings as SortID).sort_id}>
            <option value={SortIDType.EphemeralFirst}>First</option>
            <option value={SortIDType.EphemeralLast}>Last</option>
        </select>
    {/if}
</div>

<style>
    .sort {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 5px;
        align-items: center;
    }
    .sort label {
        text-align: right;
    }
</style>
