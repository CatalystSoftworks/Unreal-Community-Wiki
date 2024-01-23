<script lang="ts">
    import { navigating } from "$app/stores";
    import IconWikiLogo from "$lib/icons/wiki-logo.svg?component";

    let show = false;
    let timer: number;

    navigating.subscribe((n) => {
        clearTimeout(timer);
        if (n) {
            timer = setTimeout(() => {
                show = true;
            }, 500) as unknown as number;
        } else {
            show = false;
        }
    });
</script>

<div class="overlay" class:show>
    <IconWikiLogo />
</div>

<style>
    .overlay {
        opacity: 0;
        pointer-events: none;
        z-index: 1000;
        transition: opacity 0.2s ease-in-out;
        color: var(--text);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: throb 1s ease-in-out infinite;
    }

    .overlay:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--bg);
        z-index: 1;
        opacity: 0.9;
    }

    .show {
        opacity: 1;
        pointer-events: all;
    }

    .overlay > :global(svg) {
        position: relative;
        width: 10em;
        height: auto;
        z-index: 2;
    }

    @keyframes throb {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
</style>
