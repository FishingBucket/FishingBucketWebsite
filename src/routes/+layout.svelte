<script lang="ts">
    import '$lib/assets/themes/fluxer-dark.css';
    import '$lib/assets/common.css';
    import TopBar from '$lib/components/TopBar.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import { onMount } from 'svelte';
    import { http } from '$lib/api.svelte';
    import { Session, set_session } from '$lib/session.svelte';

    let { children } = $props();

    onMount(async () => {
        let session = new Session(undefined!, undefined!, undefined!);
        session.with_storage(localStorage);
        if (session.session_id) {
            set_session(session);
            await http.refresh_token();
        }

        setInterval(async () => {
            await http.refresh_token();
        }, 3600_000);
    });
</script>

<div class="app">
    <TopBar></TopBar>

    <main class="contents">
        {@render children()}
    </main>

    <Footer></Footer>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: var(--background-primary);
    }

    .contents {
        flex: 1;
        margin-top: 80px;
        padding: 2rem;
        max-width: 1400px;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        box-sizing: border-box;
    }

    @media (max-width: 768px) {
        .contents {
            padding: 1rem;
            margin-top: 70px;
        }
    }
</style>
