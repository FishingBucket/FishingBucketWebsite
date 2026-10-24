<script lang="ts">
    let {
        id,
        name,
        value = $bindable(),
        inverted = false,
        true_option = 'True',
        false_option = 'False',
    }: {
        id: string;
        name: string;
        value: boolean;
        inverted?: boolean;
        true_option?: string;
        false_option?: string;
    } = $props();
</script>

<select {id} {name} bind:value>
    {#if inverted}
        <option value={false}>{true_option}</option>
        <option value={true}>{false_option}</option>
    {:else}
        <option value={true}>{true_option}</option>
        <option value={false}>{false_option}</option>
    {/if}
</select>
