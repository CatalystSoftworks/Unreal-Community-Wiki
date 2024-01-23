<script lang="ts">
    import type { UserJsonResponse } from "$routes/users/[id].json/+server";
    import { onMount } from "svelte";
    import Avatar from "./Avatar.svelte";
    import IconMail from "$lib/icons/mail.svg?component";
    import IconWorldWww from "$lib/icons/world-www.svg?component";
    import IconTwitter from "$lib/icons/brand-twitter.svg?component";
    import IconGithub from "$lib/icons/brand-github.svg?component";

    export let id: string;

    let user: UserJsonResponse | null = null;

    onMount(async () => {
        const res = await fetch(`/users/${id}.json`);
        user = await res.json();
    });
</script>

<article class="card shadow">
    {#if !user}
        <header class="row-left">
            <div class="avatar skeleton" />
            <div class="stack flex-1">
                <div class="skeleton text lg" style:width="75%" />
                <div class="row-left sm">
                    <div class="skeleton text" style:width="4em" />
                    <div class="skeleton square" />
                    <div class="skeleton square" />
                    <div class="skeleton square" />
                </div>
            </div>
        </header>
        <section class="bio">
            <div class="skeleton text" style:width="90%" />
            <div class="skeleton text" style:width="45%" />
        </section>
    {:else if "error" in user}
        <header class="row-left error">
            <div class="avatar" />
            <div class="stack flex-1">
                <h3 class="lg">Error</h3>
                <p>Failed to load user info</p>
            </div>
        </header>
    {:else}
        <header class="row-left">
            <Avatar src={user.avatarUrl} name={user.displayName} size={64} />
            <div class="stack stats flex-1">
                <div class="row-left">
                    <h3 class="lg">{user.displayName}</h3>
                </div>
                <div class="row-left muted sm">
                    <span>{user.revisionCount} contributions</span>
                    {#if user.email}
                        <a
                            href="mailto:{user.email}"
                            title={user.email}
                            role="button"
                            class="subtle icon"
                        >
                            <IconMail />
                        </a>
                    {/if}
                    {#if user.socials.website}
                        <a
                            href={user.socials.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Website"
                            role="button"
                            class="subtle icon"
                        >
                            <IconWorldWww />
                        </a>
                    {/if}
                    {#if user.socials.twitter}
                        <a
                            href="https://twitter.com/{user.socials.twitter}"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Twitter"
                            role="button"
                            class="subtle icon"
                        >
                            <IconTwitter />
                        </a>
                    {/if}
                    {#if user.socials.github}
                        <a
                            href="http://github.com/{user.socials.github}"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GitHub"
                            role="button"
                            class="subtle icon"
                        >
                            <IconGithub />
                        </a>
                    {/if}
                </div>
            </div>
        </header>
        {#if user.bio}
            <section class="bio sm">
                <p>{user.bio}</p>
            </section>
        {/if}
    {/if}
</article>

<style>
    article {
        padding: 1em;
        width: 460px;
    }

    .avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
    }

    .stack {
        align-items: flex-start;
    }

    .stats {
        gap: 0.25em;
    }

    .skeleton.text,
    .skeleton.square {
        display: block;
        border-radius: 0.25em;
        width: 80%;
        height: 1em;
        content: "";
    }

    .skeleton.square {
        aspect-ratio: 1;
        min-width: 1em;
        max-width: 1em;
    }

    .bio {
        margin-top: 1em;
        line-height: 1.5;
    }

    .bio > .skeleton.text {
        margin-bottom: 0.5em;
    }
</style>
