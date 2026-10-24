<script lang="ts">
    import { CircleChevronRight as Chevron } from "@lucide/svelte";
	import type { Target } from "./DashBoard.svelte";
	import { slide } from "svelte/transition";
	import TagItem from "./TagItem.svelte";
    import type { ProxyTag, UserInformation, ID } from "$lib/models/effective";
    import { apply_tag_query, type QuerySettings } from "$lib/query/query";

    let {
        user_data,
        target,
        current_target,
        query
    }: {
        user_data: UserInformation,
        target: (target: Target) => void,
        current_target: Target,
        query: QuerySettings<ProxyTag>
    } = $props();

    function get_tag(tag: ID): ProxyTag {
		return user_data.tags.find(t => t.id.equals(tag))!;
	}

    let processed_tag_groups = $derived(apply_tag_query(user_data.tags, user_data.relationships, query));
</script>

{#snippet tags_list(items: ProxyTag[])}
    {#each items as tag, index2 (index2)}
        <TagItem {tag} onclick={(tag: ProxyTag) => {
            target({
                type: 'tag',
                data: get_tag(tag.id)
            })
        }} {current_target}></TagItem>
    {/each}
{/snippet}

<div class="tag-list">
    {#each processed_tag_groups as group, index (index)}
        {#if group.group_info.type == null}
            {@render tags_list(group.items)}
        {:else}
            <div class="group">
                {let field_visible = $state(true)}
                <div class="group-title">
                    <button class="neutered-button expand-button" class:collapsed={field_visible} onclick={() => {
                        field_visible = !field_visible;
                    }}>
                        <Chevron></Chevron>
                    </button>
                    <button class="neutered-button">
                        {#if group.group_info.type == "first_letter"}
                            {group.group_info.letter.toLocaleUpperCase()}
                        {/if}
                    </button>
                </div>
                <span class="h-bar"></span>
                {#if field_visible}
                    <div class="group-items" transition:slide>
                        {@render tags_list(group.items)}
                    </div>
                {/if}
            </div>
        {/if}
    {/each}
</div>

<style>
    .tag-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-radius: 10px;
        background-color: var(--background-primary);
        padding: 10px;
    }

    .group-items {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .expand-button {
        rotate: 0deg;
        transition: ease 0.25s rotate;
    }

    .collapsed {
        rotate: 90deg;
    }
</style>