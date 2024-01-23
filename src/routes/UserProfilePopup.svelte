<script lang="ts" context="module">
    import { writable } from "svelte/store";

    const state = writable<null | {
        id: string;
        x: number;
        y: number;
    }>(null);

    /** Show the user profile popup. */
    export function showUserProfile(id: string, x: number, y: number) {
        state.set({ id, x, y });
    }

    /** Dismiss the user profile popup. */
    export function dismissUserProfile() {
        state.set(null);
    }
</script>

<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { popup } from "$lib/popup";
    import UserCard from "$lib/components/UserCard.svelte";
    import { onMount } from "svelte";
    import Portal from "$lib/components/Portal.svelte";
    import { useScrollLock } from "$lib/scroll-locks";

    const scrollLock = useScrollLock();

    onMount(() =>
        state.subscribe((value) => {
            if (value === null) {
                scrollLock.unlock();
            } else {
                scrollLock.lock();
            }
        }),
    );

    function onkeydown(event: KeyboardEvent) {
        if ($state !== null && event.key === "Escape") {
            dismissUserProfile();
        }
    }
</script>

<svelte:window on:keydown={onkeydown} />

<Portal>
    {#if $state !== null}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <dialog
            open
            class="overlay"
            on:click|self={dismissUserProfile}
            transition:fade={{ duration: 200 }}
        >
            <div
                class="popup"
                use:popup={{ x: $state.x, y: $state.y }}
                transition:fly={{ duration: 200, y: 50 }}
            >
                <UserCard id={$state.id} />
            </div>
        </dialog>
    {/if}
</Portal>

<style>
    dialog {
        display: flex;
        z-index: 75;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: inherit;
        min-width: 100%;
        height: inherit;
        min-height: 100%;
        border: 0;
    }

    .popup {
        position: absolute;
        z-index: 76;
    }
</style>
