<script module lang="ts">
    import type { Proxy, ProxyTag } from '$lib/models/effective';

    export type Target =
        | {
              type: 'proxy';
              data: Proxy;
          }
        | {
              type: 'tag';
              data: ProxyTag;
          }
        | {
              type: null;
              data: undefined;
          };
</script>

<script lang="ts">
    import {
        ID,
        proxy_get_random_avatar,
        proxy_normalize,
        user_information_from_wire,
        type Relationship,
        type UserInformation,
    } from '$lib/models/effective';
    import ProxyList from './ProxyList.svelte';
    import Inspector from './inspector/Inspector.svelte';
    import TagList from './TagList.svelte';
    import { Plus, RotateCcw, Save } from '@lucide/svelte';
    import {
        DeleteProxyEdit,
        DeleteProxyTagEdit,
        Edits,
        NewProxyEdit,
        NewProxyTagEdit,
        SetRelationshipEdit,
    } from '$lib/models/edits';
    import { http, is_ok } from '$lib/api.svelte';
    import { Routes } from '$lib/routes';
    import type { WireUserInformation } from '$lib/models/wire';
    import { onMount } from 'svelte';
    import {
        make_default_proxy_queries,
        make_default_tag_queries,
        type QuerySettings,
    } from '$lib/query/query';
    import Filter from './query/Filter.svelte';
    import GroupBy from './query/GroupBy.svelte';
    import Sort from './query/Sort.svelte';

    let is_dirty = $state(false);
    let edits = $state(
        new Edits((d) => {
            is_dirty = d;
        }),
    );
    let next_ephemeral_id = $state(1);

    let error = $state('');

    let current_target: Target = $state({
        type: null,
        data: undefined,
    });
    let current_tab: 'proxies' | 'tags' = $state('proxies');

    let {
        wire_user_data = undefined,
    }: {
        wire_user_data: WireUserInformation | undefined;
    } = $props();

    let user_data = $state<UserInformation>({
        proxies: [],
        tags: [],
        relationships: [],
        user_id: -1,
    });

    onMount(async () => {
        reset_target();
        if (wire_user_data) {
            user_data = user_information_from_wire(wire_user_data);
        } else {
            await refetch_and_set_user_data();
        }
    });

    async function refetch_and_set_user_data() {
        let fetched = await refetch();
        if (fetched == undefined) {
            user_data = { proxies: [], tags: [], relationships: [], user_id: -1 };
        } else {
            user_data = user_information_from_wire(fetched);
        }
    }

    async function refetch(): Promise<WireUserInformation | undefined> {
        if (!http.logged_in()) return;
        const dat = await http.request<WireUserInformation>(Routes.INFO_ME, {});
        if (is_ok(dat)) {
            error = '';
            return dat.value;
        } else {
            error = dat.message;
            return undefined;
        }
    }

    async function save(): Promise<boolean> {
        const json = $state.snapshot(edits.serialize());
        const response = await http.request<unknown>(Routes.EDIT, json);
        const ok = is_ok(response);
        if (ok) {
            await refetch_and_set_user_data();
            edits.clear();
            next_ephemeral_id = 1;
        }
        return ok;
    }

    let queries: {
        proxies: QuerySettings<Proxy>;
        tags: QuerySettings<ProxyTag>;
    } = $state({
        proxies: make_default_proxy_queries(),
        tags: make_default_tag_queries(),
    });

    function target(target: Target) {
        if (
            current_target.type == target.type &&
            current_target.data &&
            target.data &&
            current_target.data.id.equals(target.data.id)
        ) {
            return;
        }

        if (current_target.type == 'proxy') {
            proxy_normalize(current_target.data);
        }

        current_target = target;
    }

    function reset_target() {
        target({
            type: null,
            data: undefined,
        });
    }

    function delete_proxy(proxy: Proxy) {
        if (current_target.type == 'proxy' && current_target.data.id == proxy.id) {
            reset_target();
        }

        user_data.proxies.splice(
            user_data.proxies.findIndex((p) => p.id == proxy.id),
            1,
        );

        edits.add_edit(new DeleteProxyEdit(proxy.id));
    }

    function delete_tag(tag: ProxyTag) {
        if (current_target.type == 'tag' && current_target.data.id == tag.id) {
            reset_target();
        }

        user_data.tags.splice(
            user_data.tags.findIndex((t) => t.id == tag.id),
            1,
        );

        edits.add_edit(new DeleteProxyTagEdit(tag.id));

        for (let relationship of user_data.relationships) {
            if (relationship.tags.some((t) => t.equals(tag.id))) {
                edits.add_edit(
                    new SetRelationshipEdit({
                        proxy: relationship.proxy,
                        tags: relationship.tags.filter((t) => !t.equals(tag.id)),
                    } satisfies Relationship),
                );
            }
        }
    }

    function new_proxy() {
        const id = new ID(next_ephemeral_id++, true);

        const proxy: Proxy = {
            id,
            name: 'New Proxy',
            description: '',
            avatar_url: proxy_get_random_avatar(),
            triggers: ['new: {}'],
            owner: user_data.user_id,
            times_used: 0,
            creation_date: Date.now() / 1000,
            nickname: '',
            effective_name: 'New Proxy',
            forms: [],
            current_form: '',
            pronouns: '',
        };

        user_data.proxies.push(proxy);
        user_data = user_data;

        target({
            type: 'proxy',
            data: proxy,
        });
        edits.add_edit(new NewProxyEdit(proxy));
    }

    function new_tag() {
        const id = new ID(next_ephemeral_id++, true);

        const tag: ProxyTag = {
            id,
            name: 'New Tag',
            description: '',
            owner: user_data.user_id,
            creation_date: Date.now() / 1000,
            tag: '',
        };

        user_data.tags.push(tag);

        target({
            type: 'tag',
            data: tag,
        });
        edits.add_edit(new NewProxyTagEdit(tag));
    }
</script>

<svelte:window
    onbeforeunload={(e) => {
        if (is_dirty) {
            e.preventDefault();
        }
    }}
/>

<div class="container">
    <div class="actionbar">
        <button
            class="small-button"
            onclick={() => {
                new_proxy();
            }}
            aria-label="new proxy"
        >
            <Plus></Plus> Proxy
        </button>
        <button
            class="small-button"
            onclick={() => {
                new_tag();
            }}
            aria-label="new tag"
        >
            <Plus></Plus> Tag
        </button>
        <button
            class="small-button yellow-button"
            onclick={async () => {
                await save();
            }}
            aria-label="save"
        >
            <Save></Save>
            {#if is_dirty}
                *Save
            {:else}
                Save
            {/if}
        </button>
        <button
            class="small-button dangerous-button"
            onclick={async () => {
                reset_target();
                user_data = user_information_from_wire((await refetch())!);
                edits.clear();
            }}
            aria-label="refresh"
        >
            <RotateCcw></RotateCcw> Refresh
        </button>
        <div class="right">
            <Filter bind:queries {current_tab}></Filter>
            <GroupBy bind:queries {current_tab}></GroupBy>
            <Sort bind:queries {current_tab}></Sort>
        </div>
    </div>
    <div class="bulk">
        <div class="section">
            <div class="proxy-or-tag">
                <button
                    disabled={current_tab == 'proxies'}
                    onclick={() => {
                        current_tab = 'proxies';
                    }}
                >
                    Proxies
                </button>
                <button
                    disabled={current_tab == 'tags'}
                    onclick={() => {
                        current_tab = 'tags';
                    }}
                >
                    Tags
                </button>
            </div>
            {#if current_tab == 'proxies'}
                <ProxyList {user_data} {target} {current_target} query={queries.proxies}
                ></ProxyList>
            {:else}
                <TagList {user_data} {target} {current_target} query={queries.tags}></TagList>
            {/if}
        </div>
        <div class="section">
            <Inspector
                bind:current_target
                {target}
                {edits}
                {delete_proxy}
                {delete_tag}
                bind:user_data
            ></Inspector>
        </div>
    </div>
    {#if error}
        <div>
            <h1>Error: {error}</h1>
        </div>
    {/if}
</div>

<style>
    .container {
        background: var(--background-secondary);
        width: 100%;
        height: auto;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .right {
        margin-left: auto;
    }

    .actionbar {
        display: flex;
        gap: 5px;
    }

    .bulk {
        display: grid;
        gap: 10px;
        grid-template-columns: 40% 1fr;
    }

    .section {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .proxy-or-tag {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5px;
    }
</style>
