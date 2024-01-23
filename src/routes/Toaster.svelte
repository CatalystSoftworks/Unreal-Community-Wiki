<script lang="ts">
    import { dismiss, notifications } from "$lib/notifications";
    import { fade, fly } from "svelte/transition";
</script>

<div class="notifications">
    {#each $notifications as n (n)}
        <div
            class="notification shadow"
            class:error={n.error}
            class:cta={n.duration <= 0 || n.actions.length > 0}
            in:fly={{ x: 20, duration: 300 }}
            out:fade
        >
            <span class="message">
                {n.message}
            </span>
            <div class="actions">
                {#each n.actions as action}
                    <button
                        on:click|preventDefault={action.action}
                        class="subtle"
                    >
                        {action.text}
                    </button>
                {/each}
                <button on:click={() => dismiss(n)} class="subtle icon">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>
            </div>
            <!-- {#if n.duration > 0}
                <div class="timer" style:animation-duration="{n.duration}ms" />
            {/if} -->
        </div>
    {/each}
</div>

<style>
    .notifications {
        position: fixed;
        bottom: 0;
        right: 0;
        pointer-events: none;
        gap: 1em;
        padding: 1em;
        max-width: 460px;
        width: 90%;
        z-index: 999;
    }

    .notification {
        position: relative;
        margin-bottom: 1em;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background: var(--success);
        color: var(--on-success);
        border-radius: var(--radius);
        padding: 1em;
        pointer-events: all;
        overflow: hidden;
        gap: 1em;
    }

    .notification.cta {
        flex-direction: column;
        place-content: flex-start;
        place-items: flex-start;
    }

    .notification.error {
        background: var(--error);
        color: var(--on-error);
    }

    .message {
        flex: 1;
        font-weight: 700;
    }
</style>
