<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade, fly } from "svelte/transition";
    import Portal from "./Portal.svelte";
    import { useScrollLock } from "$lib/scroll-locks";

    /** Whether the drawer is open. */
    export let open = false;

    /** Whether the drawer is on the right side. */
    export let right = false;

    /** Desired (max) width of the drawer. */
    export let width = "250px";

    const scrollLock = useScrollLock();

    $: x = right ? "100%" : "-100%";
    $: if (open) {
        scrollLock.lock();
    } else {
        scrollLock.unlock();
    }

    const dispatch = createEventDispatcher();

    function dismiss(e: Event) {
        e.preventDefault();
        dispatch("dismiss");
    }
</script>

<Portal>
    {#if open}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <dialog
            class="overlay"
            open
            on:click|self={dismiss}
            transition:fade={{ duration: 200 }}
        >
            <article
                class:right
                class="scroll-y"
                transition:fly={{ x, duration: 200 }}
                style:max-width={width}
            >
                <slot />
            </article>
        </dialog>
    {/if}
</Portal>

<style>
    dialog {
        display: flex;
        z-index: 50;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: inherit;
        min-width: 100%;
        height: inherit;
        min-height: 100%;
        border: 0;
        background-color: var(--dim);
    }

    article {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 90vw;
        outline: solid 5px var(--shadow-color);
        background: var(--bg);
        color: var(--text);
    }

    article.right {
        left: auto;
        right: 0;
    }

    dialog:not([open]),
    dialog[open="false"] {
        display: none;
    }
</style>
