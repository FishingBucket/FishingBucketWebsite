<script lang="ts">
    import {
        ID,
        NullID,
        proxy_get_effective_avatar_url,
        proxy_get_random_avatar,
        type Proxy,
        type UserInformation,
    } from '$lib/models/effective';
    import { Plus, RotateCcw, SquarePen, X } from '@lucide/svelte';
    import type { Target } from '../DashBoard.svelte';
    import FieldGroup from './FieldGroup.svelte';
    import { EditProxyEdit, SetRelationshipEdit, type Edits } from '$lib/models/edits';
    import ButtonedInput from '$lib/components/ui/ButtonedInput.svelte';
    import type { WireID } from '$lib/models/wire';
    import EditableAvatar from './EditableAvatar.svelte';

    let {
        proxy = $bindable(),
        edits,
        user_data = $bindable(),
        target,
    }: {
        proxy: Proxy;
        edits: Edits;
        user_data: UserInformation;
        target: (target: Target) => void;
    } = $props();

    let applied_tags: ID[] = $derived(
        (user_data.relationships.find((r) => r.proxy.equals(proxy.id))?.tags ?? []).map((id) => id),
    ); // shallow copy

    function set_applied_tags(tags: ID[]) {
        let valid_tags = tags.filter((t) => !(t instanceof NullID));
        applied_tags = valid_tags;
        let previous_index = user_data.relationships.findIndex((r) => r.proxy.equals(proxy.id));
        if (previous_index != -1) {
            user_data.relationships.splice(previous_index, 1);
        }
        user_data.relationships.push({
            proxy: proxy.id,
            tags: valid_tags,
        });
        edits.add_edit(
            new SetRelationshipEdit({
                proxy: proxy.id,
                tags: valid_tags,
            }),
        );
    }

    const current_form = {
        get current_form(): string {
            return proxy.current_form;
        },
        set current_form(v: string) {
            proxy.current_form = v;
            onblur();
        },
    };

    function onblur() {
        set_applied_tags(applied_tags);
        edits.add_edit(new EditProxyEdit(proxy));
    }
</script>

{#snippet proxy_tag_options()}
    <option value={null}></option>
    <!-- eslint-disable svelte/require-each-key -->
    {#each user_data.tags as tag}
        <option value={tag.id.to_wire()}>{tag.name}</option>
    {/each}
{/snippet}

<div class="inspector">
    <div class="row" style="gap: 20px;">
        <img
            src={proxy_get_effective_avatar_url(proxy)}
            alt="proxy avatar"
            class="avatar big-avatar"
        />
        <div
            style="flex-grow: 1; display: flex; gap: 10px; flex-direction: column; position: relative;"
        >
            <h1 style="margin: 0;">{proxy.effective_name}</h1>
            <h2 style="margin: 0;">{proxy.name}</h2>
            <button
                style="position: absolute; top: 0; right: 0;"
                onclick={() => {
                    navigator.clipboard.writeText(proxy.id.toString());
                }}
            >
                Copy ID: <span class="monospace" style="font-size: 1em;">{proxy.id}</span>
            </button>
        </div>
    </div>
    <FieldGroup title="Basic Information">
        <div class="field">
            <label for="name">Name:</label>
            <input
                name="name"
                id="name"
                placeholder="Name"
                bind:value={proxy.name}
                {onblur}
                class:error={!proxy.name}
            />
        </div>
        <div class="field">
            <label for="nickname">Nickname:</label>
            <input
                name="nickname"
                id="nickname"
                placeholder="Nickname"
                bind:value={proxy.nickname}
                {onblur}
            />
        </div>
        <div class="field">
            <label for="pronouns">Pronouns:</label>
            <input
                name="pronouns"
                id="pronouns"
                placeholder="Pronouns"
                bind:value={proxy.pronouns}
                {onblur}
            />
        </div>
        <div class="field">
            <label for="avatar">Avatar:</label>
            <EditableAvatar
                bind:value={
                    () => proxy.avatar_url,
                    (v: string) => {
                        proxy.avatar_url = v;
                        onblur();
                    }
                }
                alt="proxy avatar"
                size="big"
            ></EditableAvatar>
        </div>
        <div class="field">
            <p>Metadata:</p>
            <table>
                <thead>
                    <tr>
                        <th>Date Created</th>
                        <th>Messages Sent</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td
                            >{new Intl.DateTimeFormat().format(
                                new Date(proxy.creation_date * 1000),
                            )}</td
                        >
                        <td>{proxy.times_used}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </FieldGroup>
    <FieldGroup title="Triggers, Tags, and Forms">
        <div class="vfield">
            <label for="triggers">Triggers:</label>
            <div id="triggers" class="flexed">
                <!-- eslint-disable @typescript-eslint/no-unused-vars -->
                {#each proxy.triggers as _, index (index)}
                    <ButtonedInput
                        buttons={[
                            {
                                type: 'button',
                                label: 'delete trigger',
                                icon: X,
                                onclick: () => {
                                    proxy.triggers.splice(index, 1);
                                    proxy.triggers = proxy.triggers;
                                },
                                subtype: 'x-button',
                            },
                        ]}
                        id={`trigger-${index}`}
                        name={`trigger-${index}`}
                        placeholder="Trigger"
                        bind:value={proxy.triggers[index]}
                        {onblur}
                    ></ButtonedInput>
                {/each}
                <button
                    aria-label="new trigger"
                    onclick={() => {
                        proxy.triggers.push(`new${proxy.triggers.length}: {}`);
                    }}
                >
                    <Plus></Plus> Trigger
                </button>
            </div>
        </div>
        <div class="vfield">
            <label for="tags">Tags:</label>
            <div id="tags" class="flexed">
                {#each applied_tags as tag_id, index}
                    <div class="tag-row">
                        <select
                            name={`tag-${index}`}
                            style="width: 100%;"
                            bind:value={
                                () => tag_id.to_wire(),
                                (v: WireID | null) => {
                                    let new_applied_tags = applied_tags.map((id) => id);
                                    if (v != null) {
                                        new_applied_tags[index] = ID.from_wire(v);
                                    } else {
                                        new_applied_tags.splice(index, 1);
                                    }
                                    set_applied_tags(new_applied_tags);
                                }
                            }
                            class:error={applied_tags.filter((t) => t.equals(tag_id)).length > 1 ||
                                tag_id instanceof NullID}
                        >
                            {@render proxy_tag_options()}
                        </select>
                        {#if !(tag_id instanceof NullID)}
                            <button
                                aria-label="inspect tag"
                                style="padding: 0.7em;"
                                onclick={() => {
                                    target({
                                        type: 'tag',
                                        data: user_data.tags.find((t) => t.id.equals(tag_id))!,
                                    });
                                }}
                            >
                                <SquarePen></SquarePen>
                            </button>
                        {/if}
                        <button
                            style="padding: 0.7em;"
                            aria-label="delete"
                            onclick={() => {
                                applied_tags.splice(index, 1);
                                set_applied_tags(applied_tags);
                            }}
                        >
                            <X></X>
                        </button>
                    </div>
                {/each}
                <button
                    aria-label="new tag"
                    onclick={() => {
                        applied_tags = applied_tags.concat(new NullID());
                    }}
                >
                    <Plus></Plus> Tag
                </button>
            </div>
        </div>
        <div class="vfield">
            <label for="forms">Forms:</label>
            <div id="forms" style="display: flex; gap: 5px; flex-direction: column; flex-grow: 1;">
                {#each proxy.forms as form, index}
                    <div class="proxy-form">
                        <input
                            type="radio"
                            style="flex-grow: 0;"
                            name="proxy-form-radio-group"
                            bind:group={current_form.current_form}
                            value={form.key}
                        />
                        <EditableAvatar
                            bind:value={
                                () => form.avatar_url,
                                (v: string) => {
                                    form.avatar_url = v;
                                    onblur();
                                }
                            }
                            alt="form avatar"
                            size="small"
                        ></EditableAvatar>
                        <ButtonedInput
                            id={`form-${index}-name`}
                            name={`form-${index}-name`}
                            placeholder="Form name"
                            bind:value={form.key}
                            buttons={[
                                {
                                    type: 'button',
                                    subtype: 'x-button',
                                    label: 'delete form',
                                    icon: X,
                                    onclick: () => {
                                        proxy.forms.splice(index, 1);
                                        if (proxy.current_form == form.key) {
                                            current_form.current_form = '';
                                        }
                                        onblur();
                                    },
                                },
                            ]}
                        ></ButtonedInput>
                    </div>
                {/each}
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%">
                    <button
                        aria-label="new form"
                        onclick={() => {
                            proxy.forms.push({
                                key: 'form name',
                                avatar_url: proxy_get_random_avatar(),
                            });
                            proxy.forms = proxy.forms;
                        }}
                    >
                        <Plus></Plus> Form
                    </button>
                    <button
                        aria-label="reset current form"
                        onclick={() => {
                            current_form.current_form = '';
                            onblur();
                        }}
                    >
                        <RotateCcw></RotateCcw> Reset current form
                    </button>
                </div>
            </div>
        </div>
    </FieldGroup>
    <div class="vfield">
        <label for="description">Description:</label>
        <textarea
            name="description"
            id="description"
            placeholder="Description"
            bind:value={proxy.description}
            {onblur}
        ></textarea>
    </div>
</div>

<style>
    p {
        margin: 2px 0;
    }

    .inspector {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .row {
        display: flex;
        flex-direction: row;
        gap: 5px;
    }

    .field {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }

    .vfield {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .field input {
        flex-grow: 1;
        width: 100%;
    }

    .big-avatar {
        height: 6em;
        border: 5px solid var(--background-primary);
    }

    .small-avatar {
        height: 2.5em;
    }

    .flexed {
        display: flex;
        gap: 5px;
        flex-direction: column;
        flex-grow: 1;
    }

    .proxy-form {
        flex-grow: 1;
        position: relative;
        display: flex;
        gap: 5px;
        width: 100%;
        align-items: center;
    }

    .tag-row {
        flex-grow: 1;
        display: flex;
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 5px;
    }
</style>
