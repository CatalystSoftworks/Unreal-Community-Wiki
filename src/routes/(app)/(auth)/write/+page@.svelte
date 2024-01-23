<script lang="ts">
    import PageInfoModal from "./PageInfoModal.svelte";
    import PublishModal from "./PublishModal.svelte";
    import MarkdownRenderer from "$lib/components/MarkdownRenderer.svelte";
    import type { PageData } from "./$types";
    import { onDestroy, onMount } from "svelte";
    import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
    import IconSend from "$lib/icons/send.svg?component";
    import IconFileInfo from "$lib/icons/file-info.svg?component";
    import IconMapBolt from "$lib/icons/map-bolt.svg?component";
    import { createEditorState } from "./editorState";
    import type { Tool } from "./tools";
    import ImageUploader from "./ImageUploader.svelte";
    import BlueprintModal from "./BlueprintModal.svelte";

    export let data: PageData;

    const state = createEditorState({
        markdown: data.page?.markdown ?? "",
        tags: data.page?.tags ?? [],
        title: data.page?.title ?? "",
        description: data.page?.description ?? "",
        revId: data.page?.revId ?? null,
        changeMessage: "",
    });

    let editorEl: HTMLDivElement;
    let monaco: typeof Monaco;
    let tools: Tool[] = [];
    let editor: Monaco.editor.IStandaloneCodeEditor;
    let showingPageInfoModal = !$state.title || !$state.description; // show drawer by default if creating new page
    let showingImageModal = false;
    let showingPublishModal = false;
    let showingBlueprintModal = false;
    let uploading = false;

    onMount(async () => {
        monaco = (await import("./monaco")).default;

        tools = (await import("./tools")).TOOLS;

        editor = monaco.editor.create(editorEl, {
            value: $state.markdown,
            language: "markdown",
            theme: data.theme === "dark" ? "vs-dark" : "vs-light",
            automaticLayout: true,
            wordWrap: "on",
            quickSuggestions: false,
            minimap: {
                enabled: false,
            },
        });

        editor.onDidChangeModelContent(() => {
            $state.markdown = editor.getValue();
        });

        for (const tool of tools) {
            if (tool.shortcutKey) {
                editor.addCommand(
                    monaco.KeyMod.CtrlCmd | tool.shortcutKey,
                    () => tool.execute(editor),
                );
            }
        }
    });

    onDestroy(() => {
        editor?.dispose();
    });
</script>

<main>
    <header class="tools row">
        <div class="row-left" role="toolbar">
            {#each tools as tool}
                <button
                    class="icon tool"
                    title={tool.label}
                    on:click|preventDefault={() => tool.execute(editor)}
                >
                    <svelte:component this={tool.icon} size={18} />
                </button>
            {/each}
            <button
                class="icon tool"
                title="Embed Blueprint"
                on:click|preventDefault={() => (showingBlueprintModal = true)}
            >
                <IconMapBolt size={18} />
            </button>
        </div>
        <div class="row-left" role="toolbar">
            <button
                class="tool"
                title="Page Info"
                on:click|preventDefault={() => (showingPageInfoModal = true)}
            >
                <IconFileInfo size={18} />
                Page Info
            </button>
            <button
                class="primary"
                on:click|preventDefault={() => (showingPublishModal = true)}
            >
                <IconSend size={18} />
                Publish
            </button>
        </div>
    </header>
    <section class="split">
        <div bind:this={editorEl} class="editor"></div>
        <div class="preview scroll-y">
            <MarkdownRenderer markdown={$state.markdown} />
        </div>
    </section>
</main>

<PageInfoModal bind:open={showingPageInfoModal} allTags={data.tags} />

<PublishModal bind:open={showingPublishModal} />

{#if editor}
    <ImageUploader bind:uploading bind:open={showingImageModal} {editor} />

    <BlueprintModal bind:open={showingBlueprintModal} {editor} />
{/if}

<style>
    main {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .tools {
        padding: 0 0.5em;
        height: 3rem;
        background: var(--nav-bg);
        color: var(--nav-text);
    }

    .split {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: stretch;
        overflow: hidden;
    }

    .preview {
        padding: 0 2em;
        align-self: stretch;
    }

    [role="toolbar"] {
        gap: 0.25rem;
    }

    button.tool {
        background: transparent;
    }

    button.tool:hover {
        background: var(--nav-highlight);
    }
</style>
