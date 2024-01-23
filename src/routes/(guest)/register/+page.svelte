<script lang="ts">
    import { onMount } from "svelte";
    import type { ActionData } from "./$types";
    import { notify } from "$lib/notifications";

    export let form: ActionData;

    let submitting = false;
    let displayName = "";
    let email = "";

    $: disabled = submitting || !displayName || !email;

    onMount(() => {
        if (form?.error) {
            notify({ message: form.error, error: true });
        }
    });

    function onblur(e: Event) {
        const target = e.target as HTMLInputElement;
        target.classList.remove("untouched");
    }
</script>

<form method="POST" class="stack">
    <input
        type="text"
        name="displayName"
        placeholder="Display Name"
        bind:value={displayName}
        required
        class="untouched"
        on:blur={onblur}
    />

    <input
        type="email"
        name="email"
        placeholder="Email"
        bind:value={email}
        required
        class="untouched"
        on:blur={onblur}
    />

    <p class="muted sm">
        Create an account to create and edit pages. We just need to know what to
        call you and your email, so we can send you a pin to login with.
    </p>

    <button class="primary" type="submit" aria-busy={submitting} {disabled}>
        Create Account
    </button>

    <hr />

    <span>Already have an account?</span>
    <a href="/login" role="button">Login</a>
</form>

<style>
    p {
        line-height: 1.5;
    }
</style>
