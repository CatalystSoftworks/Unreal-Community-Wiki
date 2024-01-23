<script lang="ts">
    import { page } from "$app/stores";
</script>

<article>
    <p class="muted xl">{$page.error?.message ?? "Something went wrong"}</p>
    <a href="/" role="button" class="subtle">Return Home</a>
</article>

<style>
    article {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        gap: 2em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
    }

    p {
        max-width: 20em;
    }
</style>
