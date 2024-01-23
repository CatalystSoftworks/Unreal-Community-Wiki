<script lang="ts">
    import CharacterCounter from "$lib/components/CharacterCounter.svelte";
    import KeyboardMenu from "$lib/components/KeyboardMenu.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { useEditorState } from "./editorState";
    import { search } from "fast-fuzzy";
    import IconX from "$lib/icons/x.svg?component";

    export let open: boolean;

    export let allTags: string[] = [];

    const state = useEditorState();

    let titleEl: HTMLInputElement;
    let descriptionEl: HTMLTextAreaElement;
    let newTag = "";
    let showTags = false;

    $: tags = search(newTag, allTags)
        .filter((t) => !$state.tags.includes(t))
        .concat(newTag);

    function dismiss() {
        if (!$state.title) {
            titleEl?.focus();
            return;
        }

        if (!$state.description) {
            descriptionEl?.focus();
            return;
        }

        open = false;
        newTag = "";
    }

    function onblur(e: Event) {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        target.classList.remove("untouched");
    }

    function ontagkeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            e.preventDefault();
            (e.target as HTMLInputElement)?.blur();
        }
    }

    function ontagfocus(e: Event) {
        showTags = true;
    }

    function ontagblur(e: Event) {
        showTags = false;
    }

    function ontagselect(e: CustomEvent<string>) {
        if (!e.detail) return;
        if ($state.tags.includes(e.detail)) return;

        $state.tags = [...$state.tags, e.detail];
        newTag = "";

        if ($state.tags.length >= 5) {
            const input = e.target as HTMLInputElement;
            input?.blur();
        }
    }

    function removeTag(e: Event, i: number) {
        e.preventDefault();
        $state.tags.splice(i, 1);
        $state.tags = [...$state.tags];
    }
</script>

<Modal {open} width="800px" on:dismiss={dismiss}>
    <section class="meta stack">
        <input
            bind:this={titleEl}
            type="text"
            class="untouched"
            placeholder="Page Title"
            maxlength="128"
            bind:value={$state.title}
            on:blur={onblur}
            required
        />

        <textarea
            bind:this={descriptionEl}
            rows="4"
            class="untouched"
            placeholder="Short summary of the page"
            maxlength="255"
            bind:value={$state.description}
            on:blur={onblur}
            required
        />
        <CharacterCounter value={$state.description} max={255} />

        <section class="tags">
            <div class="row-left">
                {#each $state.tags as tag, i}
                    <button
                        class="tag sm"
                        title="Remove Tag {tag}"
                        on:click={(e) => removeTag(e, i)}
                    >
                        <strong>{tag}</strong>
                        <IconX />
                    </button>
                {/each}
            </div>

            <div class="new-tag">
                <input
                    type="text"
                    placeholder="Add a tag..."
                    maxlength="32"
                    disabled={$state.tags.length >= 5}
                    bind:value={newTag}
                    on:keydown={ontagkeydown}
                    on:focus={ontagfocus}
                    on:blur={ontagblur}
                />
                {#if newTag && tags.length > 0 && showTags}
                    <dialog open class="scroll-y">
                        <KeyboardMenu
                            items={tags}
                            on:select={ontagselect}
                            let:item
                        >
                            {item}
                        </KeyboardMenu>
                    </dialog>
                {/if}
            </div>
        </section>

        <div class="row-right">
            <button
                title="Dismiss"
                class="primary"
                disabled={!$state.title || !$state.description}
                on:click|preventDefault={dismiss}
            >
                Close
            </button>
        </div>
    </section>
</Modal>

<style>
    .meta {
        align-items: stretch;
        padding: 2em;
    }

    .tags {
        position: relative;
        margin-top: 2em;
    }

    .tag > :global(svg) {
        width: 1em;
        height: auto;
    }

    .new-tag {
        position: relative;
        margin-top: 1em;
        margin-bottom: 1em;
    }

    dialog {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        margin: 0.25em 0 0;
        border: 0;
        background: var(--fg);
        color: var(--text);
        border-radius: var(--radius);
        padding: 0.25em;
        z-index: 100;
        max-height: 10em;
    }
</style>
