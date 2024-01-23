<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";

    export let ignore = false;

    let ref: HTMLElement;
    let portal: HTMLElement;

    if (!ignore && browser) {
        onMount(() => {
            portal = document.createElement("div");
            portal.className = "portal";
            document.body.appendChild(portal);
            portal.appendChild(ref);
        });

        onDestroy(() => {
            document.body.removeChild(portal);
        });
    }
</script>

{#if ignore}
    <slot />
{:else}
    <div bind:this={ref}>
        <slot />
    </div>
{/if}
