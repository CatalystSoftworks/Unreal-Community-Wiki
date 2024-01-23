import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

const KEY = Symbol("EDITOR");


export interface EditorState {
    /** ID of the page if we're publishing a revision for an existing page. */
    revId?: null | string;
    /** Title of the page. */
    title: string;
    /** Description of the page. */
    description: string;
    /** Markdown content of the page. */
    markdown: string;
    /** Tags of the page. */
    tags: string[];
    /** Change message for the revision. */
    changeMessage: string;
}


/** Returns the current editor state context (if any). */
export function useEditorState() {
    const ctx = getContext<Writable<EditorState>>(KEY);

    if (!ctx) {
        throw new Error("Editor state context not found - do not use outside of editor");
    }

    return ctx;
}

/** Creates a new editor state context using the given initial state. */
export function createEditorState(initial: EditorState) {
    const store = writable(initial);
    setContext(KEY, store);
    return store;
}