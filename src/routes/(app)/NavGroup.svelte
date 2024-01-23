<script lang="ts">
    /** Name for the filter group. */
    export let label = "";

    /** Is the nav group collapsed? */
    export let collapsed = false;

    function toggle() {
        collapsed = !collapsed;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if label}
    <div class="header" class:collapsed on:click={toggle}>
        {label}
    </div>
{/if}

{#if !collapsed}
    <div class="group">
        <slot />
    </div>
{/if}

<style>
    .header {
        position: relative;
        font-weight: bold;
        font-size: 0.875rem;
        opacity: 0.6;
    }

    .header:after {
        content: "";
        position: absolute;
        top: 50%;
        right: 1em;
        border-bottom: currentColor solid 2px;
        border-right: currentColor solid 2px;
        width: 0.5em;
        height: 0.5em;
        transform: translateY(-50%) rotate(45deg);
        transition: transform 0.2s ease-in-out;
    }

    .header:hover {
        opacity: 0.9;
    }

    .header.collapsed:after {
        transform: translateY(-50%) rotate(135deg);
    }

    .header.collapsed,
    .group {
        margin-bottom: 2em;
    }

    .header {
        border-radius: var(--radius);
        padding: 0.75em 1em;
        cursor: pointer;
        user-select: none;
    }

    .header:hover {
        background-color: var(--highlight);
    }
</style>
