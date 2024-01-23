<script lang="ts">
    import CharacterCounter from "$lib/components/CharacterCounter.svelte";
    import type { ActionData, PageData } from "./$types";
    import Avatar from "$lib/components/Avatar.svelte";
    import Toggle from "$lib/components/Toggle.svelte";
    import IconBrandGithub from "$lib/icons/brand-github.svg?component";
    import IconBrandTwitter from "$lib/icons/brand-twitter.svg?component";
    import IconLogout from "$lib/icons/logout.svg?component";
    import IconMail from "$lib/icons/mail.svg?component";
    import IconWorldWww from "$lib/icons/world-www.svg?component";
    import { onMount } from "svelte";
    import { notify } from "$lib/notifications";

    export let data: PageData;
    export let form: ActionData;

    let loggingOut = false;
    let submitting = false;

    $: profile = form?.profile ?? data.profile;
    $: disabled = submitting || loggingOut;
    $: canSave = !!profile.displayName && profile.bio.length <= 256;

    onMount(() => {
        if (form?.error) {
            notify({ message: form.error, error: true });
        } else if (form?.success) {
            notify({ message: form.success });
        }
    });

    function onlogout(e: Event) {
        loggingOut = true;
    }

    function onsubmit(e: Event) {
        submitting = true;
    }

    function onfilechange(e: Event) {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            profile.avatarUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
</script>

<header>
    <form
        action="?/logout"
        method="POST"
        class="row-right"
        on:submit={onlogout}
    >
        <button
            type="submit"
            {disabled}
            aria-busy={loggingOut}
            title="Logout"
            aria-label="Logout"
        >
            {#if loggingOut}
                <span>Logging Out</span>
            {:else}
                <IconLogout />
                Logout
            {/if}
        </button>
    </form>
</header>

<form
    action="?/updateProfile"
    method="POST"
    enctype="multipart/form-data"
    on:submit={onsubmit}
>
    <article class="card stack">
        <div class="row-left">
            <label for="avatar" class="avatar-upload">
                <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    accept="image/*"
                    on:change={onfilechange}
                />
                <Avatar
                    src={profile.avatarUrl}
                    name={profile.displayName}
                    size={64}
                />
            </label>

            <div class="flex-1">
                <input
                    type="text"
                    name="displayName"
                    placeholder="Display Name"
                    bind:value={profile.displayName}
                    required
                />
            </div>
        </div>

        <div class="bio">
            <textarea
                name="bio"
                placeholder="Provide a short description of yourself"
                bind:value={profile.bio}
                rows={3}
                maxlength={256}
            />

            <CharacterCounter value={profile.bio} max={256} />
        </div>

        <div class="row-left">
            <IconMail />
            <input
                type="email"
                class="flex-1"
                readonly
                name="email"
                value={profile.email}
            />
            <Toggle
                name="emailPublic"
                value={profile.emailPublic}
                label="Make Email Public"
            />
        </div>

        <div class="row-left">
            <IconWorldWww />

            <input
                type="text"
                class="flex-1"
                name="website"
                pattern="https?://.+"
                placeholder="https://"
                value={profile.website}
            />
        </div>

        <div class="row-left">
            <IconBrandTwitter />
            <div class="social-field row-left">
                <span>https://twitter.com/</span>
                <input
                    type="text"
                    class="flex-1"
                    name="twitter"
                    placeholder="username"
                    value={profile.twitter}
                />
            </div>
        </div>

        <div class="row-left">
            <IconBrandGithub />
            <div class="social-field row-left">
                <span>https://github.com</span>
                <input
                    type="text"
                    class="flex-1"
                    name="github"
                    placeholder="username"
                    value={profile.github}
                />
            </div>
        </div>

        <!-- <div class="row-left">
            <IconBrandDiscord />
            <div class="social-field row-left">
                <span>https://discord.com/</span>
                <input
                    type="text"
                    class="flex-1"
                    placeholder="username#1234"
                    value={profile.socials.discord}
                />
            </div>
        </div> -->

        <div class="row-right">
            <button
                type="submit"
                class="primary"
                disabled={disabled || !canSave}
                aria-busy={submitting}
            >
                {#if submitting}
                    <span>Saving Changes</span>
                {:else}
                    Save Changes
                {/if}
            </button>
        </div>
    </article>
</form>

<style>
    article {
        align-items: stretch;
    }

    .social-field {
        flex: 1;
        gap: 0.25em;
    }

    .social-field > input {
        flex: 1;
        width: 100%;
        max-width: 100%;
    }

    .bio {
        margin-bottom: 1em;
    }

    label.avatar-upload {
        cursor: pointer;
    }

    input[type="file"] {
        display: none;
    }
</style>
