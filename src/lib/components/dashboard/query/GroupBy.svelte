<script lang="ts">
    import Dialog, { Button, Level } from '$lib/components/ui/Dialog.svelte';
    import type { ProxyTag, Proxy } from '$lib/models/effective';
    import {
        GroupByProxySettings,
        GroupByTagSettings,
        type GroupBySettings,
    } from '$lib/query/group';
    import {
        make_default_proxy_queries,
        make_default_tag_queries,
        type QuerySettings,
    } from '$lib/query/query';
    import { Boxes } from '@lucide/svelte';

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

    let open_proxies_group: () => void = $state()!;
    let open_tags_group: () => void = $state()!;

    let proxy_group_settings: GroupBySettings<Proxy> = $state()!;
    let tag_group_settings: GroupBySettings<ProxyTag> = $state()!;

    function make_copy() {
        proxy_group_settings = queries.proxies.group_by ?? make_default_proxy_queries().group_by!;
        tag_group_settings = queries.tags.group_by ?? make_default_tag_queries().group_by!;
    }
</script>

<Dialog
    title="Group proxies"
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
                proxy_group_settings = make_default_proxy_queries().group_by!;
            },
        ],
        [
            Button.OK,
            (self, close) => {
                close();
                queries.proxies.group_by = proxy_group_settings;
            },
        ],
    ]}
    bind:open={open_proxies_group}
>
    <label for="group-proxies">Group By:</label>
    <select id="group-proxies" name="group-proxies" bind:value={proxy_group_settings}>
        <option value={GroupByProxySettings.None}>None</option>
        <option value={GroupByProxySettings.FirstTag}>First Tag</option>
        <option value={GroupByProxySettings.AllTags}>All Tags</option>
        <option value={GroupByProxySettings.FirstLetter}>First Letter</option>
    </select>
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
                tag_group_settings = make_default_tag_queries().group_by!;
            },
        ],
        [
            Button.OK,
            (self, close) => {
                close();
                queries.tags.group_by = tag_group_settings;
            },
        ],
    ]}
    bind:open={open_tags_group}
>
    <label for="group-tags">Group By:</label>
    <select id="group-tags" name="group-tags" bind:value={tag_group_settings}>
        <option value={GroupByTagSettings.None}>None</option>
        <option value={GroupByTagSettings.FirstLetter}>First Letter</option>
    </select>
</Dialog>

<button
    class="small-button gray-button"
    onclick={() => {
        make_copy();
        if (current_tab == 'proxies') {
            open_proxies_group();
        } else {
            open_tags_group();
        }
    }}
    aria-label="group"
>
    <Boxes></Boxes>
</button>
