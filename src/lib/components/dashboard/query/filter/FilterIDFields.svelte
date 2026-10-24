<script lang="ts">
    import type { FilterID } from '$lib/query/filter';
    import FilterNumberFields from './FilterNumberFields.svelte';

    let {
        filter = $bindable(),
        filter_name,
    }: {
        filter: FilterID;
        filter_name: string;
    } = $props();
</script>

<label for={filter_name + ' id type'}>ID Type:</label>
<select id={filter_name + '-id-type'} name={filter_name + ' id type'} bind:value={filter.id_type}>
    <option value="concrete">Pre-existing IDs</option>
    <option value="ephemeral">Unsaved new IDs only</option>
    <option value="both">Both</option>
</select>
<FilterNumberFields bind:filter={filter.numeric} type="id" {filter_name}></FilterNumberFields>
