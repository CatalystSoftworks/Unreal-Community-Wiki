<script lang="ts">
    import { createEventDispatcher } from "svelte";

    /** Whether the toggle is checked. */
    export let value = false;

    /** Whether the toggle is disabled. */
    export let disabled = false;

    /** Whether the toggle is readonly. */
    export let readonly = false;

    /** Label for the toggle. */
    export let label = "";

    /** Name for the toggle. */
    export let name: string;

    /** ID for the toggle. */
    export let id = Math.random().toString(36).slice(2);

    const dispatch = createEventDispatcher();

    function ontoggle() {
        if (disabled) return;
        value = !value;
        dispatch("change", { value });
    }
</script>

<label for={id}>
    <input
        type="checkbox"
        {name}
        {id}
        {value}
        checked={value}
        {disabled}
        on:change={ontoggle}
    />

    <div class="toggle" class:readonly class:disabled />

    {#if label}
        <strong class="sm">{label}</strong>
    {/if}
</label>

<style>
    label {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-weight: inherit;
        cursor: pointer;
        user-select: none;
        margin: 0;
    }

    input {
        display: none;
    }

    .toggle {
        position: relative;
        display: inline-block;
        width: 3em;
        height: 1.5em;
        cursor: pointer;
        margin-left: 0.5em;
        margin-right: 0.5em;
    }

    .toggle:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 10em;
        background-color: var(--border);
        transition: background-color 0.2s ease;
    }

    input:checked + .toggle:before {
        background-color: var(--primary);
    }

    .toggle.disabled {
        pointer-events: none;
    }

    .toggle.disabled {
        opacity: 0.5;
    }

    .toggle:after {
        position: absolute;
        top: 0.125em;
        left: 0.125em;
        bottom: 0.125em;
        aspect-ratio: 1/1;
        content: "";
        border-radius: 50%;
        background-color: var(--fg);
        transition: transform 0.2s ease;
        cursor: pointer;
    }

    input:checked + .toggle:after {
        transform: translateX(1.5em);
    }
</style>
