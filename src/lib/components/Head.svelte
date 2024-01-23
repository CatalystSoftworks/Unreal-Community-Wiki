<script lang="ts">
    /** Title to display in the browser tab. */
    export let title = "";

    /** Meta description for the page's content. */
    export let description: string;

    /** URL for the page (or link-back target). */
    export let url: string;

    /** URL to an image to be displayed when the page is shown via OpenGraph or Twitter card. */
    export let imageUrl: null | string = null;

    /** When true,  sets meta that requests SEO crawlers to ignore this page. */
    export let noFollow = false;

    $: title = title
        ? `${title} | Unreal Engine Community Wiki`
        : "Unreal Engine Community Wiki";
    $: domain = new URL(url).hostname;
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />

    {#if noFollow}
        <meta name="robots" content="noindex, nofollow" />
    {/if}

    <!-- Twitter Card -->
    {#if imageUrl}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={imageUrl} />
    {:else}
        <meta name="twitter:card" content="summary" />
    {/if}
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:site" content={domain} />

    <!-- OpenGraph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    {#if imageUrl}
        <meta property="og:image" content={imageUrl} />
    {/if}
</svelte:head>

<style>
</style>
