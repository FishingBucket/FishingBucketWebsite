<script lang="ts">
    import './filter.css';

    import {
        get_default_filter,
        type FilterID,
        type FilterList,
        type FilterNumeric,
        type FilterString,
    } from '$lib/query/filter';
    import FilterNumberFields from './FilterNumberFields.svelte';
    import { Plus } from '@lucide/svelte';
    import FilterStringFields from './FilterStringFields.svelte';
    import FilterIDFields from './FilterIDFields.svelte';

    let {
        filter = $bindable(),
        filter_name,
        type,
    }: {
        type: 'numeric' | 'string' | 'id';
        filter: typeof type extends 'numeric'
            ? FilterList<FilterNumeric>
            : typeof type extends 'string'
              ? FilterList<FilterString>
              : FilterList<FilterID>;
        filter_name: string;
    } = $props();
</script>

<label for={filter_name + ' filter type'}>Keep If:</label>
<select
    id={filter_name + ' filter type'}
    name={filter_name + ' filter type'}
    bind:value={
        () => filter.class,
        (v) => {
            filter.class = v;
            if (filter.class == 'any') {
                filter.any = [get_default_filter(type) as FilterID]; // weird hack
            } else if (filter.class == 'all') {
                filter.all = [get_default_filter(type) as FilterID]; // weird hack
            }
        }
    }
>
    <option value="truthy">Not empty</option>
    <option value="falsy">Empty</option>
    <option value="any">Any element matches...</option>
    <option value="all">All elements match at least...</option>
</select>
{#if filter.class == 'any'}
    <label for={filter_name + '-condition'}>One of:</label>
    <div id={filter_name + '-condition'} class="condition-list">
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each filter.any as _, index (index)}
            <div class="filtering subfilter">
                {#if type == 'numeric'}
                    <FilterNumberFields
                        bind:filter={filter.any[index] as unknown as FilterNumeric}
                        filter_name={filter_name + ' item ' + (index + 1).toString()}
                        type="numeric"
                    ></FilterNumberFields>
                {:else if type == 'id'}
                    <FilterIDFields
                        bind:filter={filter.any[index] as unknown as FilterID}
                        filter_name={filter_name + ' item ' + (index + 1).toString()}
                    ></FilterIDFields>
                {:else if type == 'string'}
                    <FilterStringFields
                        bind:filter={filter.any[index] as unknown as FilterString}
                        filter_name={filter_name + ' item ' + (index + 1).toString()}
                    ></FilterStringFields>
                {/if}
            </div>
        {/each}
        <button
            onclick={() => {
                filter.any.push(get_default_filter(type) as FilterID); // weird hack
            }}
        >
            <Plus></Plus> Condition
        </button>
    </div>
{:else if filter.class == 'all'}
    <label for={filter_name + '-condition'}>One of:</label>
    <div id={filter_name + '-condition'} class="condition-list">
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each filter.all as _, index (index)}
            <div class="filtering subfilter">
                {#if type == 'numeric'}
                    <FilterNumberFields
                        bind:filter={filter.all[index] as unknown as FilterNumeric}
                        filter_name={filter_name + ' item ' + (index + 1).toString()}
                        type="numeric"
                    ></FilterNumberFields>
                {:else if type == 'id'}
                    <FilterIDFields
                        bind:filter={filter.all[index] as unknown as FilterID}
                        filter_name={filter_name + ' item ' + (index + 1).toString()}
                    ></FilterIDFields>
                {:else if type == 'string'}
                    <FilterStringFields
                        bind:filter={filter.all[index] as unknown as FilterString}
                        filter_name={filter_name + ' item ' + (index + 1).toString()}
                    ></FilterStringFields>
                {/if}
            </div>
        {/each}
        <button
            onclick={() => {
                filter.all.push(get_default_filter(type) as FilterID); // weird hack
            }}
        >
            <Plus></Plus> Condition
        </button>
    </div>
{/if}

<style>
    .condition-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
</style>
