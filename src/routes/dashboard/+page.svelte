<script lang="ts">
    import { http, is_ok } from '$lib/api.svelte';
    import { Routes } from '$lib/routes';
    import DashBoard from '$lib/components/dashboard/DashBoard.svelte';
    import { CONFIG_PUBLIC } from '$lib/config';
    import type { WireUserInformation } from '$lib/models/wire';
</script>

<svelte:head>
    <title>Dashboard | {CONFIG_PUBLIC.name}</title>
</svelte:head>

{#if http.logged_in()}
    {#await http.request<WireUserInformation>(Routes.INFO_ME, {})}
        <h1>Loading data...</h1>
    {:then user_data}
        {#if is_ok(user_data)}
            <DashBoard wire_user_data={user_data.value}></DashBoard>
        {:else}
            <h1>Error while fetching data! {user_data.message}</h1>
        {/if}
    {/await}
{:else}
    <h1>You must be logged in to use the dashboard!</h1>
{/if}
