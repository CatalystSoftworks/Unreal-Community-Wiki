<script lang="ts">
    import type { PageData } from "./$types";
    import MarkdownRenderer from "$lib/components/MarkdownRenderer.svelte";
    import Head from "$lib/components/Head.svelte";

    export let data: PageData;
</script>

<Head
    title={data.meta.title}
    description={data.meta.description}
    url={data.origin}
/>

<MarkdownRenderer markdown={data.page} />

<style>
</style>
