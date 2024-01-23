<script lang="ts">
    import type { SvelteComponent } from "svelte";

    /** Label for the nav item. */
    export let label: string;

    /** Title for the nav item. */
    export let title = label;

    /** URI to jump to when the item is clicked. */
    export let href: string;

    /** Optional count to display next to the label. */
    export let count: null | number = null;

    /** Is the link active? */
    export let active = false;

    /** Icon to use for the nav item. */
    export let icon: null | typeof SvelteComponent<{}> = null;

    /** Should we open the link in a new window? */
    export let newWindow = false;
</script>

<a
    {href}
    class="row-left"
    class:with-icon={icon}
    class:active
    {title}
    on:click
    target={newWindow ? "_blank" : undefined}
    rel={newWindow ? "noopener" : undefined}
>
    {#if icon !== null}
        <svelte:component this={icon} />
    {/if}
    <span class="ellipsis flex-1">{label}</span>
    {#if count !== null}
        <div class="count">
            <span class="muted">{count}</span>
        </div>
    {/if}
</a>

<style>
    a {
        border-radius: var(--radius);
        padding: 0.5em 1em;
        cursor: pointer;
        user-select: none;
        color: inherit;
    }

    a:hover {
        background-color: var(--highlight);
    }

    a.active {
        color: inherit;
    }

    .count {
        display: block;
        padding: 0.25em 0.5em;
        font-size: 0.75em;
        background: var(--highlight);
        border-radius: 10rem;
    }

    a > :global(svg) {
        margin-left: -0.25em;
        margin-right: 0.5em;
        opacity: 0.5;
    }

    a:hover > :global(svg) {
        opacity: 1;
    }

    @media (min-width: 768px) {
        a {
            height: 2.5em;
            font-size: 0.875rem;
        }

        .count {
            font-size: 0.75rem;
        }
    }
</style>
