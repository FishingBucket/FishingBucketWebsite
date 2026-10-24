<script lang="ts">
    import Dialog, { Button, Level } from '$lib/components/ui/Dialog.svelte';
    import { ArrowDownWideNarrow } from '@lucide/svelte';
    import type { ProxyTag, Proxy } from '$lib/models/effective';
    import {
        make_default_proxy_queries,
        make_default_tag_queries,
        type QuerySettings,
    } from '$lib/query/query';
    import { SORT_BY_PROXY, SORT_BY_TAG, type SortSettings } from '$lib/query/sort';
    import ConcreteTypeSort from './sort/ConcreteTypeSort.svelte';

    let {
        queries = $bindable(),
        current_tab,
    }: {
        queries: {
            proxies: QuerySettings<Proxy>;
            tags: QuerySettings<ProxyTag>;
        };
        current_tab: 'proxies' | 'tags';
    } = $props();

    let open_proxies_sort: () => void = $state()!;
    let open_tags_sort: () => void = $state()!;

    let proxy_sort_settings: SortSettings<Proxy> = $state()!;
    let tag_sort_settings: SortSettings<ProxyTag> = $state()!;

    function copy<T>(t: T): T {
        return JSON.parse(JSON.stringify(t));
    }

    function make_copy() {
        proxy_sort_settings = queries.proxies.sort
            ? copy(queries.proxies.sort)
            : make_default_proxy_queries().sort!;
        tag_sort_settings = queries.tags.sort
            ? copy(queries.tags.sort)
            : make_default_tag_queries().sort!;
    }
</script>

<Dialog
    title="Sort proxies"
    level={Level.INFO}
    buttons={[
        [
            Button.CANCEL,
            (self, close) => {
                close();
            },
        ],
        [
            Button.RESET,
            () => {
                proxy_sort_settings = make_default_proxy_queries().sort!;
            },
        ],
        [
            Button.OK,
            (self, close) => {
                queries.proxies.sort = proxy_sort_settings;
                close();
            },
        ],
    ]}
    bind:open={open_proxies_sort}
>
    <ConcreteTypeSort bind:sort_settings={proxy_sort_settings} fields={SORT_BY_PROXY}
    ></ConcreteTypeSort>
</Dialog>

<Dialog
    title="Group tags"
    level={Level.INFO}
    buttons={[
        [
            Button.CANCEL,
            (self, close) => {
                close();
            },
        ],
        [
            Button.RESET,
            () => {
                tag_sort_settings = make_default_tag_queries().sort!;
            },
        ],
        [
            Button.OK,
            (self, close) => {
                queries.tags.sort = tag_sort_settings;
                close();
            },
        ],
    ]}
    bind:open={open_tags_sort}
>
    <ConcreteTypeSort bind:sort_settings={tag_sort_settings} fields={SORT_BY_TAG}
    ></ConcreteTypeSort>
</Dialog>

<button
    class="small-button gray-button"
    onclick={() => {
        make_copy();
        if (current_tab == 'proxies') {
            open_proxies_sort();
        } else {
            open_tags_sort();
        }
    }}
    aria-label="group"
>
    <ArrowDownWideNarrow></ArrowDownWideNarrow>
</button>
