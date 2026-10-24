<script lang="ts">
    let {
        id,
        name,
        placeholder = 'number',
        value = $bindable(),
        type,
    }: {
        id: string;
        name: string;
        placeholder?: string;
        value: number;
        type: 'numeric' | 'id' | 'date';
    } = $props();

    let temporary_value = $derived.by(() => {
        switch (type) {
            case 'id':
                return '0x' + value.toString(16);
            case 'numeric':
                return value.toString();
            case 'date':
                // Source - https://stackoverflow.com/a/62845336
                // Posted by owencm
                //  Retrieved 2026-10-18, License - CC BY-SA 4.0
                return new Date(
                    ((value ?? Date.now() / 1000) - new Date().getTimezoneOffset() * 60) * 1000,
                )
                    .toISOString()
                    .slice(0, 19);
            default: {
                const _exhaustive: never = type;
                return _exhaustive;
            }
        }
    });
    let error = $state(false);

    function update(new_value: string) {
        temporary_value = new_value;
        error = false;
        switch (type) {
            case 'id':
            case 'numeric': {
                let v: number;
                if (temporary_value.startsWith('new+')) {
                    v = parseInt(temporary_value.slice('new+'.length));
                } else {
                    v = parseInt(temporary_value);
                }
                if (Number.isNaN(v)) {
                    error = true;
                } else {
                    value = v;
                }
                return;
            }
            case 'date': {
                const parsed = Date.parse(new_value);
                if (Number.isNaN(parsed)) {
                    error = true;
                } else {
                    value = parsed / 1000;
                }
                return;
            }
            default: {
                const _exhaustive: never = type;
                return _exhaustive;
            }
        }
    }
</script>

{#if type == 'id' || type == 'numeric'}
    <input {id} {name} {placeholder} bind:value={() => temporary_value, update} class:error />
{:else if type == 'date'}
    <input
        {id}
        {name}
        {placeholder}
        type="datetime-local"
        bind:value={() => temporary_value, update}
        class:error
    />
{/if}
