<script lang="ts">
    import { http, is_err } from '$lib/api.svelte';
    import ButtonedInput from '$lib/components/ui/ButtonedInput.svelte';
    import Dialog, { Button, Level } from '$lib/components/ui/Dialog.svelte';
    import { Routes } from '$lib/routes';
    import { Computer, ExternalLink, Link, SquarePen, Upload } from '@lucide/svelte';

    let {
        value = $bindable(),
        alt,
        size,
    }: {
        value: string;
        alt: string;
        size: 'big' | 'small';
    } = $props();

    let open_dialog: () => void = $state(null)!;
    let upload_button: HTMLInputElement | undefined = $state(undefined);

    let selected_file: File | undefined = $state(undefined);
    let selected_file_object_url: string | undefined = $state(undefined);

    let upload_from_url: string | undefined = $state(undefined);

    function start_upload_file() {
        if (!upload_button) return;
        if (!upload_button.files) return;

        selected_file = upload_button.files[0];
        selected_file_object_url = URL.createObjectURL(selected_file);
    }

    async function upload_file() {
        if (!selected_file) return;

        let segments = selected_file.name.split('.');

        let upload_url = await http.request<{
            upload_url: string;
            cdn_url: string;
        }>(Routes.UPLOAD, {
            file_extension: segments[segments.length - 1],
        });

        if (is_err(upload_url)) {
            alert(`Error ${upload_url.code}: ${upload_url.message}`);
            return;
        }

        let { upload_url: s3_upload_url, cdn_url } = upload_url.value;

        let response = await fetch(s3_upload_url, {
            method: 'PUT',
            headers: {
                'Content-Type': selected_file.type || 'application/octet-stream',
            },
            body: selected_file,
        });

        if (response.ok) {
            value = cdn_url;

            cleanup();
        } else {
            alert(`Error ${response.status}: ${await response.text()}`);
        }
    }

    function cleanup() {
        if (selected_file_object_url) {
            URL.revokeObjectURL(selected_file_object_url);
        }
        if (selected_file) {
            selected_file = undefined;
        }
        if (upload_button) {
            upload_button.value = '';
        }
        if (upload_from_url) {
            upload_from_url = undefined;
        }
    }

    function set_as_upload_avatar_url(v: string) {
        upload_from_url = v;
        fetch(v).then((response) => {
            if (response.status != 200) {
                selected_file = undefined;
            } else {
                response.blob().then((blob) => {
                    let segments = v.split('?')[0].split('/');
                    let filename = segments[segments.length - 1];
                    selected_file = new File([blob], filename, {
                        type: response.headers.get('Content-Type') ?? 'application/octet-stream',
                    });
                    selected_file_object_url = URL.createObjectURL(selected_file);
                });
            }
        });
    }
</script>

<Dialog
    title="Avatar"
    level={Level.INFO}
    buttons={[
        [
            Button.OK,
            (self, close) => {
                close();
            },
        ],
    ]}
    bind:open={open_dialog}
    onclose={cleanup}
>
    <div style="display: flex; flex-direction: column; gap: 10px;">
        <div class="avatar-dialog">
            <div class="big-avatar" style="grid-column: 1; grid-row: 1 / 3;">
                <img class="avatar big-avatar bordered" src={value} {alt} />
            </div>
            <div style="grid-column: 2 / 4; grid-row: 1;">
                <ButtonedInput
                    bind:value
                    placeholder="Avatar URL"
                    type="url"
                    buttons={[{ type: 'a', label: 'open URL', icon: ExternalLink, href: value }]}
                ></ButtonedInput>
            </div>
            <div style="grid-column: 2; grid-row: 2; position: relative;">
                <input
                    style="position: absolute; top: 0; left: 0; opacity: 0 !important; width: 100%;"
                    tabindex="-1"
                    type="file"
                    bind:this={upload_button}
                    accept="image/*"
                    onchange={start_upload_file}
                />
                <button
                    style="position: absolute; top: 0; left: 0; width: 100%;"
                    onclick={() => {
                        if (!upload_button) return;

                        upload_button.click();
                    }}
                >
                    Upload From Computer
                    <Computer></Computer>
                </button>
            </div>
            <button
                style="grid-column: 3; grid-row: 2;"
                onclick={() => {
                    upload_from_url = value;
                    set_as_upload_avatar_url(upload_from_url);
                }}
            >
                Upload From URL
                <Link></Link>
            </button>
        </div>
        {#if upload_from_url != undefined}
            <ButtonedInput
                bind:value={() => upload_from_url ?? '', set_as_upload_avatar_url}
                placeholder="URL to upload from"
                type="url"
                buttons={[{ type: 'a', label: 'open URL', icon: ExternalLink, href: value }]}
            ></ButtonedInput>
            <img alt="proxy avatar" src={upload_from_url} />
            <button onclick={upload_file} disabled={selected_file == undefined}>
                <Upload></Upload> Start Upload
            </button>
        {/if}
        {#if selected_file && selected_file_object_url && !upload_from_url}
            <img alt="proxy avatar" src={selected_file_object_url} />
            <button onclick={upload_file}>
                <Upload></Upload> Start Upload
            </button>
        {/if}
    </div>
</Dialog>

<div
    style="aspect-ratio: 1; box-sizing: border-box; border: none;"
    class:big-avatar={size == 'big'}
    class:small-avatar={size == 'small'}
>
    <div
        class="editable-avatar"
        class:big-avatar={size == 'big'}
        class:small-avatar={size == 'small'}
        style="border: none"
    >
        <img
            src={value}
            {alt}
            class="avatar"
            class:big-avatar={size == 'big'}
            class:small-avatar={size == 'small'}
        />
        <button
            class="neutered-button avatar overlay-button"
            class:big-avatar={size == 'big'}
            class:bordered={size == 'big'}
            class:small-avatar={size == 'small'}
            onclick={open_dialog}
        >
            {#if size == 'big'}
                View or Upload
            {:else}
                <SquarePen name="View or Upload"></SquarePen>
            {/if}
        </button>
    </div>
</div>

<style>
    .editable-avatar {
        position: relative;
    }

    .editable-avatar button {
        position: absolute;
        top: 0;
        left: 0;
    }

    .big-avatar {
        height: 6em;
    }

    .bordered {
        border: 5px solid var(--background-primary);
    }

    .small-avatar {
        height: 2.5em;
    }

    .overlay-button {
        background-color: rgba(0, 0, 0, 0);
        color: rgba(0, 0, 0, 0);
        transition: 0.2s ease-in-out background-color color;
    }

    .overlay-button:hover {
        background-color: rgba(0, 0, 0, 50%);
        color: var(--text-primary);
    }

    .avatar-dialog {
        display: grid;
        grid-template-columns: 6em 1fr 1fr;
        grid-template-rows: auto auto;
        gap: 10px;
    }
</style>
