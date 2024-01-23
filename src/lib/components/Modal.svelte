<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { useScrollLock } from "$lib/scroll-locks";
    import Portal from "./Portal.svelte";
    import { fade, fly } from "svelte/transition";

    const dispatch = createEventDispatcher();

    /** Whether the modal is open. */
    export let open = false;

    /** Desired (max) width of the modal. */
    export let width = "250px";

    const scrollLock = useScrollLock();

    $: if (open) {
        scrollLock.lock();
    } else {
        scrollLock.unlock();
    }

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
            class="overlay scroll-y"
            {open}
            on:click|self={dismiss}
            transition:fade={{ duration: 200 }}
        >
            <article
                style:max-width={width}
                transition:fly={{ y: 100, duration: 200 }}
            >
                <slot />
            </article>
        </dialog>
    {/if}
</Portal>

<style>
    dialog {
        display: flex;
        z-index: 100;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        align-items: center;
        justify-content: center;
        width: inherit;
        min-width: 100%;
        height: inherit;
        min-height: 100%;
        padding: 1rem;
        border: 0;
        background-color: var(--dim);
    }

    article {
        position: relative;
        border-radius: var(--radius);
        width: 90vw;
        max-width: 50rem;
        outline: solid 5px var(--shadow-color);
        background: var(--bg);
        color: var(--text);
    }

    dialog:not([open]),
    dialog[open="false"] {
        display: none;
    }
</style>
