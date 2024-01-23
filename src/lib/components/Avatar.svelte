<script lang="ts">
    import { hashCode, getInitials } from "$lib/formatting";

    /** The name of the user or entity being represented. */
    export let name: string;

    /** The URL of the avatar image. */
    export let src = "";

    // create initials from the name
    const initials = getInitials(name || "");

    // create a random color using the name as a seed
    const color = `hsl(${Math.abs(hashCode(name || "")) % 360}, 50%, 50%)`;

    /** The width/height of the avatar. */
    export let size: number | string = "2.5em";

    // create a style for the avatar
    const _size = typeof size === "number" ? `${size}px` : size;
    const style = `background-color: ${color}; font-size: ${_size};`;
</script>

<div class="avatar" {style} aria-label={name} title={name}>
    <span class="initials">{initials}</span>
    {#if src}
        <img class="image" {src} alt={name} />
    {/if}
</div>

<style>
    .avatar {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        overflow: hidden;
        background-color: #ccc;
        user-select: none;
    }

    .initials {
        color: #fff;
        text-transform: uppercase;
        font-size: 0.4em;
        font-weight: 600;
        pointer-events: none;
    }

    .image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        pointer-events: none;
    }
</style>
