<script lang="ts">
    import Dialog, { Button, Level } from '$lib/components/ui/Dialog.svelte';
    import type { ProxyTag, Proxy } from '$lib/models/effective';
    import {
        make_default_proxy_queries,
        make_default_tag_queries,
        type QuerySettings,
    } from '$lib/query/query';
    import { Funnel } from '@lucide/svelte';
    import ConcreteTypeFilter from './filter/ConcreteTypeFilter.svelte';
    import { FILTER_FIELDS_PROXY, FILTER_FIELDS_TAG, type FilterTypes } from '$lib/query/filter';

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

    function copy<T>(t: T): T {
        return JSON.parse(JSON.stringify(t));
    }

    function make_copy() {
        previous_state = copy(
            queries[current_tab] ??
                (current_tab == 'proxies'
                    ? make_default_proxy_queries().filter!
                    : make_default_tag_queries().filter!),
        );
    }

    let open_proxies_filter: () => void = $state(() => void undefined);
    let open_tags_filter: () => void = $state(() => void undefined);

    let previous_state: QuerySettings<Proxy | ProxyTag> = $state()!;
</script>

<Dialog
    title="Filter proxies"
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
                previous_state.filter = make_default_proxy_queries().filter!;
            },
        ],
        [
            Button.OK,
            (self, close) => {
                queries.proxies = previous_state as QuerySettings<Proxy>;
                close();
            },
        ],
    ]}
    bind:open={open_proxies_filter}
>
    <ConcreteTypeFilter
        fields={FILTER_FIELDS_PROXY}
        bind:filter={
            () =>
                (previous_state.filter ?? {}) as {
                    [key: string]: FilterTypes;
                },
            (v) => {
                previous_state.filter = v;
            }
        }
    ></ConcreteTypeFilter>
</Dialog>

<Dialog
    title="Filter tags"
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
                previous_state.filter = make_default_tag_queries().filter!;
            },
        ],
        [
            Button.OK,
            (self, close) => {
                queries.tags = previous_state as QuerySettings<ProxyTag>;
                close();
            },
        ],
    ]}
    bind:open={open_tags_filter}
>
    <ConcreteTypeFilter
        fields={FILTER_FIELDS_TAG}
        bind:filter={
            () =>
                (previous_state.filter ?? {}) as {
                    [key: string]: FilterTypes;
                },
            (v) => {
                previous_state.filter = v;
            }
        }
    ></ConcreteTypeFilter>
</Dialog>

<button
    class="small-button gray-button"
    onclick={() => {
        make_copy();
        if (current_tab == 'proxies') {
            open_proxies_filter();
        } else {
            open_tags_filter();
        }
    }}
    aria-label="filter"
>
    <Funnel></Funnel>
</button>
