<script lang="ts">
    import type { SvelteComponent } from "svelte";

    /** Items to be included in the dropdown. */
    export let items: Record<string, string> = {};

    /** The currently selected item(s). */
    export let selected: string | string[] = "";

    /** The key used to pass the selected value(s) to the server. */
    export let name: string;

    /** Icon to display next to the dropdown. */
    export let icon: typeof SvelteComponent<{}>;

    /** Label to use when no items are selected. */
    export let placeholder: string;

    $: multiple = Array.isArray(selected);

    let el: HTMLDetailsElement;

    function open() {
        el.open = true;
    }

    function dismiss() {
        el.open = false;
    }

    function onchange(e: Event, value: string) {
        if (multiple) {
            const index = selected.indexOf(value);
            if (index === -1) {
                selected = [...selected, value];
            } else {
                // selected = selected.filter((_, i) => i !== index);
            }
        } else {
            selected = value;
            dismiss();
        }
    }
</script>

<details role="list" bind:this={el}>
    <summary aria-haspopup="listbox" class="row-left">
        <svelte:component this={icon} />

        {#if multiple}
            {#if selected.length === 0}
                <span>{placeholder}</span>
            {:else if selected.length === 1}
                <span>{items[selected[0]]}</span>
            {:else}
                <span>{selected.length} selected</span>
            {/if}
        {:else if typeof selected === "string"}
            <span>{items[selected]}</span>
        {:else}
            <span>{placeholder}</span>
        {/if}
    </summary>
    <ul role="listbox" class="scroll-y shadow">
        {#each Object.entries(items) as [value, label]}
            <li>
                <label>
                    <input
                        type={multiple ? "checkbox" : "radio"}
                        {name}
                        {value}
                        on:change={(e) => onchange(e, value)}
                    />
                    <span class="icon" />
                    {label}
                </label>
            </li>
        {/each}
    </ul>
</details>

<style>
    details {
        padding: 0;
        position: relative;
        border-bottom: none;
    }

    summary {
        margin-bottom: 0;
        height: var(--ctrl-height);
        padding: 0 1rem;
        font-weight: bold;
        font-size: 0.875em;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        gap: 0.5em;
        white-space: nowrap;
        user-select: none;
    }

    summary::-webkit-details-marker {
        display: none;
    }

    ul {
        display: flex;
        z-index: 99;
        position: absolute;
        top: 100%;
        right: 0;
        width: 15em;
        gap: 0;
        flex-direction: column;
        margin: 4px 0 0;
        padding: 0;
        white-space: nowrap;
        border-radius: var(--radius);
        background: var(--fg);
        max-height: 300px;
    }

    li {
        width: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    label {
        display: block;
        padding: 0.5em 1em;
        cursor: pointer;
        font-weight: inherit;
        font-size: 1em;
        color: inherit;
        text-align: left;
        margin: 0;
    }

    label:hover {
        background: var(--highlight);
    }

    input[type="radio"],
    input[type="checkbox"] {
        display: none;
    }

    /* input[type="radio"] + span.icon {
        display: inline-block;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        border: 2px solid var(--border);
        margin-right: 0.5em;
        vertical-align: middle;
    }

    input[type="radio"]:checked + span.icon {
        background: var(--primary);
        border-color: var(--primary);
    } */

    input[type="checkbox"] + span.icon {
        display: inline-block;
        width: 1em;
        height: 1em;
        border-radius: 2px;
        border: 2px solid var(--border);
        margin-right: 0.5em;
        vertical-align: middle;
    }

    input[type="checkbox"]:checked + span.icon {
        background: var(--primary);
        border-color: var(--primary);
    }
</style>
