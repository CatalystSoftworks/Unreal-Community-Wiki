<script lang="ts">
    import { onMount, tick } from "svelte";
    import type { PageData, ActionData } from "./$types";
    import PinInput from "./PinInput.svelte";
    import { notify } from "$lib/notifications";

    export let data: PageData;
    export let form: ActionData;

    let formEl: HTMLFormElement;
    let email = form?.email ?? data.email ?? "";
    const onPinStep = !!email;
    let pin = form?.pin ?? "";
    let submitting = false;

    $: disabled = submitting || !email;
    $: action = onPinStep ? `?/verify&email=${email}` : "?/request";

    function onsubmit(e: Event) {
        submitting = true;
    }

    async function oncomplete(e: CustomEvent<{ value: string }>) {
        await tick();
        formEl?.submit();
    }

    function onblur(e: Event) {
        const target = e.target as HTMLInputElement;
        target.classList.remove("untouched");
    }

    onMount(() => {
        if (form?.error) {
            notify({ message: form.error, error: true });
        }
    });
</script>

<form bind:this={formEl} {action} method="POST" on:submit={onsubmit}>
    {#if onPinStep}
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="pin" value={pin} />

        <PinInput bind:value={pin} on:complete={oncomplete} />

        <p class="sm muted">
            Enter the pin code we sent to <strong>{data.email}</strong> to log in.
            This pin will be valid for 2 minutes. Be sure to check your spam folder
            if you don't see it.
        </p>

        <div class="row">
            <a href="/login" role="button" target="_self">
                Request New Pin 
            </a>
            <button
                class="primary"
                type="submit"
                disabled={disabled || pin.length !== 6}
                aria-busy={submitting}
            >
                <span>
                    {#if submitting}
                        Logging In
                    {:else}
                        Log In
                    {/if}
                </span>
            </button>
        </div>
    {:else}
        <input
            name="email"
            type="email"
            placeholder="Your Email"
            class="untouched"
            on:blur={onblur}
            bind:value={email}
            required
        />

        <p class="sm muted">
            Enter your email address and we'll send you a pin code to log in
            with (provided you have an account). This pin will be valid for 2
            minutes.
        </p>

        <div class="row">
            <a href="/register" role="button">
                Create Account
            </a>
            <button
                class="primary"
                type="submit"
                {disabled}
                aria-busy={submitting}
            >
                {#if submitting}
                    <span>Requesting Pin</span>
                {:else}
                    <span>Request Login Pin</span>
                {/if}
            </button>
        </div>
    {/if}
</form>

<style>
    p {
        margin: 2em 0;
        line-height: 1.5;
    }
</style>
