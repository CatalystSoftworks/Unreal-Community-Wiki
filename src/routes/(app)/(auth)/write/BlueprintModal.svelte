<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";
    import { notify } from "$lib/notifications";
    import type { editor } from "monaco-editor";

    export let open: boolean;

    export let editor: editor.IStandaloneCodeEditor;

    let submitting = false;
    let title = "";
    let blueprint = "";

    $: disabled = !title || !blueprint || submitting;

    function dismiss() {
        if (submitting) return;
        open = false;
        title = "";
        blueprint = "";
    }

    async function submit() {
        if (submitting) return;
        try {
            submitting = true;
            const res = await fetch("/write/blueprint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, blueprint }),
            });

            if (!res.ok) {
                throw new Error("Received non-200 response");
            }

            const { id, error } = await res.json();
            if (error) {
                throw error;
            }

            // insert the blueprint markdown into the editor
            const pos = editor.getPosition();
            if (!pos) return;

            const line =
                editor.getModel()?.getLineContent(pos.lineNumber) ?? "";
            const indent = line.match(/^\s+/)?.[0] ?? "";
            const text = `${indent}{{blueprint id="${id}"}}`;
            editor.executeEdits("", [
                {
                    range: {
                        startLineNumber: pos.lineNumber,
                        startColumn: 1,
                        endLineNumber: pos.lineNumber,
                        endColumn: 1,
                    },
                    text,
                    forceMoveMarkers: true,
                },
            ]);

            editor.focus();

            // move the cursor to the end of the line
            editor.setPosition({
                lineNumber: pos.lineNumber,
                column: text.length + 1,
            });

            open = false;
            title = "";
            blueprint = "";
        } catch (e) {
            const msg =
                typeof e === "string" ? e : "Failed to upload blueprint";
            console.error(e);
            notify({ message: msg, error: true });
        } finally {
            submitting = false;
        }
    }
</script>

<Modal {open} width="800px" on:dismiss={dismiss}>
    <section class="stack">
        <input type="text" bind:value={title} placeholder="Blueprint Title" />
        <textarea
            rows="4"
            bind:value={blueprint}
            placeholder="Paste Blueprint Code Here"
        />
        <footer class="row-right">
            <button
                title="Cancel"
                disabled={submitting}
                on:click|preventDefault={dismiss}
            >
                Cancel
            </button>
            <button
                class="primary"
                aria-busy={submitting}
                {disabled}
                on:click={submit}
            >
                {#if submitting}
                    <span>Submitting</span>
                {:else}
                    Submit
                {/if}
            </button>
        </footer>
    </section>
</Modal>

<style>
    section {
        padding: 2em;
        align-items: stretch;
    }

    input,
    textarea {
        width: 100%;
    }

    textarea {
        resize: vertical;
    }

    .row-right {
        justify-content: flex-end;
    }
</style>
