<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    type T = $$Generic;

    /** Items to render in the popup menu. */
    export let items: T[];

    /** Optionally provide a list of items that cannot be highlighted. */
    export let disabledItems: T[] = [];

    /** Key to use to confirm a selection. */
    export let confirmKey: string = "Enter";

    /** The index of the item that is currently highlighted. */
    let highlighted = 0;

    /** The popup menu's DOM element. */
    let el: HTMLElement;

    $: if (highlighted > items.length - 1) {
        highlighted = items.length - 1;
    }

    function onkeydown(e: KeyboardEvent) {
        switch (e.key) {
            case "ArrowUp":
                shiftHighlight(e, -1);
                break;
            case "ArrowDown":
                shiftHighlight(e, 1);
                break;
            case confirmKey:
                e.preventDefault();
                e.stopPropagation();
                dispatch("select", items[highlighted]);
                break;
        }
    }

    function shiftHighlight(e: Event, delta: number) {
        e.preventDefault();
        e.stopPropagation();

        // shift the highlighted item by delta, skipping disabled items along the way
        // we do this instead of a while loop to avoid infinite loops
        // for (let i = 0; i < items.length; i++) {
        let j = highlighted + delta; // * i;

        // wrap value i around if it's out of bounds of the items array
        j = ((j % items.length) + items.length) % items.length;

        // did we find a non-disabled item?
        if (!disabledItems.includes(items[j])) {
            highlighted = j;
            // scroll the highlighted item into view
            const item = el.children[j] as HTMLElement;
            item.focus();
            item.scrollIntoView({ block: "nearest" });
            // break;
        }
        // }
    }

    function mouseover(e: Event, i: number) {
        e.preventDefault();
        e.stopPropagation();
        if (disabledItems.includes(items[i])) return;
        highlighted = i;
    }

    function select(e: Event, item: T) {
        e.preventDefault();
        e.stopPropagation();
        if (disabledItems.includes(item)) return;
        dispatch("select", item);
    }
</script>

<svelte:window on:keydown={onkeydown} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<menu bind:this={el} class="items scroll-y">
    {#each items as item, i}
        {@const selected = i === highlighted}
        {@const disabled = disabledItems.includes(item)}
        <div
            class="item row"
            class:selected
            class:disabled
            on:click={(e) => select(e, item)}
            on:mouseenter={(e) => mouseover(e, i)}
        >
            <slot {item} {i} {selected} />
        </div>
    {/each}
</menu>

<!-- <div class="help row">
    <span><kbd>{confirmKey}</kbd> to select</span>
    <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
    <span><kbd>Esc</kbd> to dismiss</span>
</div> -->

<style>
    .items {
        flex: 1;
        max-height: 100%;
    }

    .item {
        position: relative;
        cursor: pointer;
        padding: 0 1rem;
        min-height: var(--ctrl-height);
        border-radius: var(--radius);
        border: 0;
    }

    .item.selected {
        background: var(--highlight);
    }

    .item.selected:before {
        display: none;
    }

    /* .help {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-align: center;
        padding: 0.25rem;
    }

    kbd {
        background: transparent;
        border: solid 1px var(--border);
        border-radius: var(--border-radius);
        font: inherit;
        color: inherit;
        padding: 0.25rem;
    } */
</style>
