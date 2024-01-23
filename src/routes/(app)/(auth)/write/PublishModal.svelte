<script lang="ts">
    import { notify } from "$lib/notifications";
    import { goto } from "$app/navigation";
    import Modal from "$lib/components/Modal.svelte";
    import { useEditorState } from "./editorState";
    import CharacterCounter from "$lib/components/CharacterCounter.svelte";

    export let open: boolean;

    const state = useEditorState();

    let publishing = false;
    // let value = "# Hello, world!\nthis is **test** text";

    async function publish(e: Event) {
        e.preventDefault();

        const res = await fetch(`/write/publish`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: $state.title,
                description: $state.description,
                tags: $state.tags,
                markdown: $state.markdown,
                revId: $state.revId,
                changeMessage: $state.changeMessage,
            }),
        });

        if (!res.ok) {
            notify({ message: "Failed to publish revision.", error: true });
            console.error(res);
            return;
        }

        const { error, path } = await res.json();
        if (error) {
            notify({ message: error, error: true });
            console.error(error);
            return;
        }

        if (!path) {
            notify({
                message: "Something went wrong while publishing your revision.",
                error: true,
            });
            console.error(res);
            return;
        }

        notify({ message: "Your revision has been published." });
        goto("/" + path);
    }

    function dismiss() {
        if (publishing) return;
        open = false;
    }
</script>

<Modal {open} width="800px" on:dismiss={dismiss}>
    <section class="commit stack">
        <p>
            Enter a short description explaining what you wrote or changed. If
            this is a brand new page you can simply enter "Created page". This
            appears in the page history for each revision.
        </p>
        <textarea
            rows="2"
            placeholder="Enter a short description of your changes..."
            maxlength="128"
            bind:value={$state.changeMessage}
        />
        <CharacterCounter value={$state.changeMessage} max={128} />
    </section>
    <footer class="commit row-right">
        <button disabled={publishing} on:click|preventDefault={dismiss}>
            Not yet
        </button>
        <button
            class="primary"
            on:click={publish}
            disabled={publishing || !$state.changeMessage}
            aria-busy={publishing}
        >
            {#if publishing}
                <span>Publishing Changes</span>
            {:else}
                Publish Changes
            {/if}
        </button>
    </footer>
</Modal>

<style>
    .commit {
        padding: 2em;
        align-items: stretch;
    }

    .commit > p {
        line-height: 1.5;
    }
</style>
