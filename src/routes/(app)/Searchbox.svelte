<script lang="ts">
    import { trpc } from "$lib/api";
    import { fly } from "svelte/transition";
    import { goto } from "$app/navigation";
    import CloseIcon from "carbon-icons-svelte/lib/Close.svelte";

    let query = "";
    let timeout: number;
    let results: { title: string; path: string }[] = [];
    let showMoreButton = false;
    let fetching = false;
    let focused = false;
    let inputEl: HTMLInputElement;
    let highlighted = 0;

    async function search() {
        try {
            fetching = true;
            const { hasMore, pages } = await trpc.quickSearch.query({ query });
            results = pages;
            showMoreButton = hasMore;
            highlighted = Math.max(
                0,
                Math.min(highlighted, results.length - 1)
            );
        } catch (error) {
            console.error(error);
        } finally {
            fetching = false;
        }
    }

    function onchange() {
        fetching = true;
        clearTimeout(timeout);
        timeout = setTimeout(search, 500) as unknown as number;
        query = inputEl.value;
    }

    function onfocus() {
        focused = true;
    }

    function onblur() {
        // focused = false;
        clearTimeout(timeout);
    }

    function onkeydown(e: KeyboardEvent) {
        if (!focused) {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                inputEl.focus();
            }
            return;
        }

        switch (e.key) {
            case "Escape":
                e.preventDefault();
                e.stopPropagation();
                focused = false;
                inputEl.blur();
                return;
            case "ArrowDown":
                e.preventDefault();
                e.stopPropagation();
                highlighted = Math.min(highlighted + 1, results.length - 1);
                return;
            case "ArrowUp":
                e.preventDefault();
                e.stopPropagation();
                highlighted = Math.max(highlighted - 1, 0);
                return;
            case "Enter":
                e.preventDefault();
                e.stopPropagation();
                if (results.length) {
                    goto(results[highlighted].path);
                }
                return;
        }
    }

    function clear() {
        query = "";
        results = [];
    }

    function onclear(e: Event) {
        e.preventDefault();
        clear();
        inputEl.focus();
    }
</script>

<svelte:window on:keydown={onkeydown} />

<div class="search">
    <div class="control">
        <input
            bind:this={inputEl}
            type="search"
            value={query}
            placeholder="Search..."
            on:focus={onfocus}
            on:input={onchange}
            on:blur={onblur}
        />
        {#if query}
            <button
                class="clear-button icon subtle"
                title="Clear"
                aria-label="Clear"
                on:click={onclear}
            >
                <CloseIcon size={24} />
            </button>
        {/if}
    </div>

    {#if focused && query}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="overlay" on:click={() => (focused = false)} />

        <div
            class="results shadow"
            class:fetching
            aria-busy={fetching}
            transition:fly={{ duration: 200, opacity: 0, y: 20 }}
        >
            {#if !fetching}
                {#each results as result, i}
                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                    <a
                        href={result.path}
                        class="result"
                        class:highlighted={i === highlighted}
                        on:mouseover={() => (highlighted = i)}
                        on:click={clear}
                    >
                        {result.title}
                    </a>
                {:else}
                    <div class="no-results center">No results found.</div>
                {/each}

                {#if results.length > 0}
                    <div class="actions row h-between">
                        <div class="actions-help muted row xs">
                            <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
                            <span><kbd>↵</kbd> to select</span>
                        </div>
                        {#if showMoreButton}
                            <a
                                href="/?q={query}"
                                class="show-more sm"
                                on:click={clear}
                            >
                                Show More
                            </a>
                        {/if}
                    </div>
                {/if}
            {/if}
        </div>
    {/if}
</div>

<style>
    .search {
        flex: 1;
        max-width: 40rem;
        position: relative;
        z-index: 5;
    }

    input {
        border-radius: 10rem;
        background: var(--surface);
    }

    .control {
        position: relative;
    }

    .results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin-top: 1rem;
        background: var(--surface);
        color: var(--on-surface);
        border-radius: var(--radius);
        padding: 1rem;
    }

    /* .results::before {
        position: absolute;
        left: auto;
        display: block;
    } */

    .no-results {
        height: 5rem;
    }

    .result {
        display: block;
        color: inherit;
        padding: 0.75rem 1rem;
        border-radius: var(--radius);
    }

    .result:focus,
    .result.highlighted {
        border: solid 2px var(--primary);
    }

    .actions {
        margin-top: 1rem;
        gap: 1rem;
        padding: 0 1rem;
    }

    .actions-help {
        justify-content: flex-start;
        gap: 1rem;
    }

    kbd {
        font: inherit;
        color: inherit;
        padding: 0.125rem 0.25rem;
        border-radius: var(--radius);
        border: solid 2px currentColor;
    }

    .clear-button {
        position: absolute;
        top: 50%;
        right: 0.5rem;
        transform: translateY(-50%);
        border-radius: 50%;
    }
</style>
