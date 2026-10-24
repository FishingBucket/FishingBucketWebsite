<script lang="ts">
    import './filter.css';

    import { get_default_filter, type FilterNumeric, type FilterString } from '$lib/query/filter';
    import BooleanInput from './BooleanInput.svelte';
    import StringInput from './StringInput.svelte';
    import FilterNumberFields from './FilterNumberFields.svelte';

    let {
        filter = $bindable(),
        filter_name,
    }: {
        filter: FilterString;
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
            if (filter.class == 'length' && (!('length' in filter) || filter.length)) {
                filter.length = get_default_filter('numeric') as FilterNumeric;
            }
        }
    }
>
    <option value="truthy">Not empty</option>
    <option value="falsy">Empty</option>
    <option value="contains">Contain...</option>
    <option value="startswith">Start with...</option>
    <option value="endswith">End with...</option>
    <option value="length">Has length...</option>
    <option value="regex">Matches Regex...</option>
</select>
{#if filter.class == 'contains' || filter.class == 'startswith' || filter.class == 'endswith'}
    {#if filter.class == 'contains'}
        <label for={filter_name + ' contain'}>Contain:</label>
        <StringInput
            id={filter_name + '-contain'}
            name={filter_name + ' contain'}
            placeholder="The text must contain..."
            bind:value={filter.contains}
            type="string"
        ></StringInput>
    {:else if filter.class == 'startswith'}
        <label for={filter_name + ' start with'}>Start With:</label>
        <StringInput
            id={filter_name + '-start-with'}
            name={filter_name + ' start with'}
            placeholder="The text must start with..."
            bind:value={filter.startswith}
            type="string"
        ></StringInput>
    {:else if filter.class == 'endswith'}
        <label for={filter_name + ' end with'}>End With:</label>
        <StringInput
            id={filter_name + '-end-with'}
            name={filter_name + ' end with'}
            placeholder="The text must end with..."
            bind:value={filter.endswith}
            type="string"
        ></StringInput>
    {/if}
    <label for={filter_name + ' case sensitive'}>Case Sensitive:</label>
    <BooleanInput
        id={filter_name + '-case-sensitive'}
        name={filter_name + ' case sensitive'}
        bind:value={filter.case_insensitive}
        true_option="Case insensitive"
        false_option="Case sensitive"
    ></BooleanInput>
{:else if filter.class == 'length'}
    <label for={filter_name + '-length'}>Length:</label>
    <div id={filter_name + '-length'} class="filtering subfilter">
        <FilterNumberFields bind:filter={filter.length} {filter_name} type="numeric"
        ></FilterNumberFields>
    </div>
{:else if filter.class == 'regex'}
    <label for={filter_name + ' regex'}>Regex:</label>
    <StringInput
        id={filter_name + '-regex'}
        name={filter_name + ' regex'}
        placeholder="The text must match..."
        bind:value={filter.regex}
        type="regex"
    ></StringInput>
{/if}
