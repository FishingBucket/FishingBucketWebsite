<script lang="ts">
    import './filter.css';

    import {
        get_default_filter,
        type FilterID,
        type FilterKind,
        type FilterList,
        type FilterNumeric,
        type FilterString,
        type FilterTypes,
    } from '$lib/query/filter';
    import { Plus, X } from '@lucide/svelte';
    import FilterNumberFields from './FilterNumberFields.svelte';
    import FilterStringFields from './FilterStringFields.svelte';
    import FilterIDFields from './FilterIDFields.svelte';
    import FilterListFields from './FilterListFields.svelte';

    let {
        fields,
        filter = $bindable(),
    }: {
        fields: {
            [key: string]: [string, FilterKind];
        };
        filter: {
            [key in keyof typeof fields]: FilterTypes;
        };
    } = $props();
</script>

<div class="filters">
    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
    {#each Object.keys(filter) as key, index (index)}
        <div class="filter-element">
            <div class="filter-field">
                <select
                    name={`filter-${key}`}
                    bind:value={
                        () => key,
                        (v: string) => {
                            filter = Object.fromEntries(Object.entries(filter).map(
                                ([key_previous, value], i) =>
                                    i == index
                                        ? [v, get_default_filter(fields[v][1])]
                                        : [key_previous, value]
                            ));
                        }
                    }
                >
                    {#each Object.entries(fields) as [possible_key, [display]], index2 (index2)}
                        {#if !(possible_key in filter && possible_key != key)}
                            <option value={possible_key}>{display}</option>
                        {/if}
                    {/each}
                </select>
                <button
                    onclick={() => {
                        delete filter[key];
                        filter = filter;
                    }}
                >
                    <X></X>
                </button>
            </div>
            {#if key && Object.keys(filter[key]).length}
                {let filter_kind = $derived(fields[key][1])}
                <div class="filtering">
                    {#if filter_kind == 'date'}
                        <FilterNumberFields
                            bind:filter={filter[key] as FilterNumeric}
                            filter_name={key}
                            type="date"
                        ></FilterNumberFields>
                    {:else if filter_kind == 'id'}
                        <FilterIDFields bind:filter={filter[key] as FilterID} filter_name={key}
                        ></FilterIDFields>
                    {:else if filter_kind == 'numeric'}
                        <FilterNumberFields
                            bind:filter={filter[key] as FilterNumeric}
                            filter_name={key}
                            type="numeric"
                        ></FilterNumberFields>
                    {:else if filter_kind == 'string'}
                        <FilterStringFields
                            bind:filter={filter[key] as FilterString}
                            filter_name={key}
                        ></FilterStringFields>
                    {:else if filter_kind[0] == 'list'}
                        <FilterListFields
                            // weird fuck hack
                            bind:filter={filter[key] as FilterList<FilterID>}
                            filter_name={key}
                            type={filter_kind[1]}
                        ></FilterListFields>
                    {/if}
                </div>
            {/if}
        </div>
    {/each}
    <button
        onclick={() => {
            filter[''] = {} as FilterTypes;
        }}
        disabled={Object.keys(filter).length >= Object.keys(fields).length}
        aria-label="new filter"
    >
        <Plus></Plus> Filter
    </button>
</div>

<style>
    .filter-field {
        display: flex;
        flex-direction: row;
        gap: 5px;
        height: 100%;
    }
</style>
