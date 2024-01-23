/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="svelte" />
/// <reference types="vite/client" />



declare module "$lib/icons/*.svg" {
    const t: string;
    export default t;
}

declare module "$lib/icons/*.svg?component" {
    import type { SvelteComponent } from "svelte";
    const t: typeof SvelteComponent;
    export default t;
}