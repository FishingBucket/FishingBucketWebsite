<script lang="ts">
    import type { FilterNumeric } from '$lib/query/filter';
    import BooleanInput from './BooleanInput.svelte';
    import NumericInput from './NumericInput.svelte';

    let {
        filter = $bindable(),
        filter_name,
        type,
    }: {
        filter: FilterNumeric;
        filter_name: string;
        type: 'numeric' | 'id' | 'date';
    } = $props();
</script>

<label for={filter_name + ' filter type'}>Keep If:</label>
<select
    id={filter_name + ' filter type'}
    name={filter_name + ' filter type'}
    bind:value={filter.class}
>
    <option value="range">In range...</option>
    <option value=">">(&gt;) Greater than...</option>
    <option value=">=">(&ge;) Greater than or equal to...</option>
    <option value="<">(&lt;) Less than...</option>
    <option value="<=">(&le;) Less than or equal to...</option>
    <option value="==">(=) Equal to...</option>
    <option value="!=">(&ne;) Not equal to...</option>
</select>
{#if filter.class == 'range'}
    <label for={filter_name + ' lower bound'}>Lower Bound:</label>
    <NumericInput
        id={filter_name + '-lower-bound'}
        name={filter_name + ' lower bound'}
        placeholder="The number must be greater than (or equal to)..."
        bind:value={filter.lower}
        {type}
    ></NumericInput>
    <label for={filter_name + ' lower bound inclusive'}>Inclusive:</label>
    <BooleanInput
        id={filter_name + '-lower-bound-inclusive'}
        name={filter_name + ' lower bound inclusive'}
        bind:value={filter.lower_exclusive}
        inverted={true}
        true_option="Include lower bound"
        false_option="Don't include lower bound"
    ></BooleanInput>
    <label for={filter_name + ' upper bound'}>Upper Bound:</label>
    <NumericInput
        id={filter_name + '-upper-bound'}
        name={filter_name + ' upper bound'}
        placeholder="The number must be less than (or equal to)..."
        bind:value={filter.upper}
        {type}
    ></NumericInput>
    <label for={filter_name + ' upper bound inclusive'}>Inclusive:</label>
    <BooleanInput
        id={filter_name + '-upper-bound-inclusive'}
        name={filter_name + ' upper bound inclusive'}
        bind:value={filter.upper_exclusive}
        inverted={true}
        true_option="Include upper bound"
        false_option="Don't include upper bound"
    ></BooleanInput>
{:else}
    <label for={filter_name + ' compare to'}>Compare To:</label>
    <NumericInput
        id={filter_name + '-compare-to'}
        name={filter_name + ' compare to'}
        placeholder="The right side of the (in)equality is..."
        bind:value={filter.rhs}
        {type}
    ></NumericInput>
{/if}
