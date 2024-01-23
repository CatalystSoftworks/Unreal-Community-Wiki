<script lang="ts">
    import "../../markdown.scss";
    import "../../hljs.css";
    import { renderMarkdown } from "$lib/markdown";

    export let markdown: string;

    $: html = renderMarkdown(markdown);
</script>

<div class="markdown">
    {@html html}
</div>