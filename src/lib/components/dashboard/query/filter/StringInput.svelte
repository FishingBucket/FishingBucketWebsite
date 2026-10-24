<script lang="ts">
    let {
        id,
        name,
        placeholder = 'string',
        value = $bindable(),
        type,
    }: {
        id: string;
        name: string;
        placeholder?: string;
        value: string;
        type: 'string' | 'regex';
    } = $props();

    let temporary_value = $derived(value);
    let error = $state(false);

    function update(new_value: string) {
        temporary_value = new_value;
        error = false;
        switch (type) {
            case 'string': {
                value = temporary_value;
                return;
            }
            case 'regex': {
                try {
                    new RegExp(temporary_value);
                    value = temporary_value;
                } catch {
                    error = true;
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

<input {id} {name} {placeholder} bind:value={() => temporary_value, update} class:error />
