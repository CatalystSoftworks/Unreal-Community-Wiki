<script lang="ts">
    import { notify } from "$lib/notifications";
    import type { editor } from "monaco-editor";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    export let editor: editor.IStandaloneCodeEditor;

    export let open: boolean;

    export let uploading: boolean;

    function dismiss() {
        if (uploading) return;
        open = false;
    }

    async function getImagesFromClipboard() {
        const clipboardData = await navigator.clipboard.read();
        const images: File[] = [];
        for (const item of clipboardData) {
            for (const type of item.types) {
                if (
                    type === "image/png" ||
                    type === "image/jpeg" ||
                    type === "image/gif" ||
                    type === "image/webp" ||
                    type === "image/svg+xml"
                ) {
                    const blob = await item.getType(type);
                    const file = new File([blob], "image", { type });
                    images.push(file);
                }
            }
        }
        return images;
    }

    async function uploadImages(images: File[]) {
        if (images.length === 0) return;

        try {
            uploading = true;

            for (const img of images) {
                const formData = new FormData();
                formData.append("image", img);

                const res = await fetch("/write/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error("Failed to upload image");
                }

                const { url, error } = await res.json();

                if (error) {
                    throw new Error(error);
                }

                // insert the image markdown into the editor
                const pos = editor.getPosition();
                if (!pos) return;

                const line =
                    editor.getModel()?.getLineContent(pos.lineNumber) ?? "";
                const indent = line.match(/^\s+/)?.[0] ?? "";
                const text = `${indent}![${img.name}](${url})`;
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
            }
        } catch (e) {
            notify({ message: "Failed to upload image.", error: true });
        } finally {
            uploading = false;
        }
    }

    onMount(async () => {
        editor.onKeyDown(async (e) => {
            if (e.keyCode === 52 && (e.ctrlKey || e.metaKey)) {
                const images = await getImagesFromClipboard();
                if (images.length === 0) return;

                e.preventDefault();
                e.stopPropagation();
                uploadImages(images);
            }
        });

        editor.addAction({
            id: "paste-image",
            label: "Paste Image",
            contextMenuGroupId: "9_cutcopypaste",
            contextMenuOrder: 20,
            async run() {
                const images = await getImagesFromClipboard();
                uploadImages(images);
            },
        });
    });
</script>

{#if uploading}
    <dialog transition:fade={{ duration: 200 }}>
        <!-- TODO: display a loader -->
    </dialog>
{/if}

<style>
    dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: var(--dim);
        z-index: 1000;
    }
</style>
