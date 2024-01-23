<script lang="ts">
    import type { PageData } from "./$types";
    import Avatar from "$lib/components/Avatar.svelte";
    import FuzzyDate from "$lib/components/FuzzyDate.svelte";
    import MarkdownRenderer from "$lib/components/MarkdownRenderer.svelte";
    import IconCalendar from "$lib/icons/calendar.svg?component";
    import IconCalendarX from "$lib/icons/calendar-x.svg?component";
    import IconLock from "$lib/icons/lock.svg?component";
    import IconPencil from "$lib/icons/pencil.svg?component";
    import IconFiles from "$lib/icons/files.svg?component";
    import IconTag from "$lib/icons/tag.svg?component";
    import Head from "$lib/components/Head.svelte";
    import Drawer from "$lib/components/Drawer.svelte";
    import { showUserProfile } from "../../UserProfilePopup.svelte";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    export let data: PageData;

    let open = false;

    function showDrawer(e: Event) {
        e.preventDefault();
        open = true;
    }

    function dismiss() {
        open = false;
    }

    function refreshVersionBlocks(version: number) {
        document.querySelectorAll(".version").forEach((e) => {
            const el = e as HTMLElement;
            const ruleStr = el.dataset.rules;
            if (!ruleStr) return;
            const rule = ruleStr.replaceAll("version", "" + version);
            el.style.display = eval(rule) ? "block" : "none";
        });
    }

    function customVersionEventWrapper(e: Event) {
        const version = (e as CustomEvent<number>).detail;
        refreshVersionBlocks(version);
    }

    onMount(() => {
        refreshVersionBlocks(data.version);
        document.addEventListener("versionchange", customVersionEventWrapper);
        return () => {
            document.removeEventListener(
                "versionchange",
                customVersionEventWrapper,
            );
        };
    });
</script>

<Head title={data.title} description={data.description} url={data.fullPath} />

{#if data.isRevision}
    <p class="banner">
        You are viewing a {data.deletedAt ? "deleted" : "specific"} page revision.
        To view the current version of this page,
        <a href={"/" + data.path}>click here</a>.
    </p>
{/if}

<article>
    <header>
        <hgroup>
            <h1>{data.title}</h1>
            <h2>{data.description}</h2>
        </hgroup>
        <div class="info row-left">
            {#if data.deletedAt}
                <span class="row-left">
                    <IconCalendarX />
                    Deleted <FuzzyDate date={data.deletedAt} />
                </span>
            {:else}
                <span class="row-left">
                    <IconCalendar />
                    Updated <FuzzyDate date={data.date} />
                </span>
            {/if}
            {#if !data.isRevision}
                {#if data.locked}
                    <span class="row-left">
                        <IconLock />
                        Locked
                    </span>
                {:else}
                    <a
                        href="/write?rev={data.revisionId}"
                        class="subtle"
                        role="button"
                    >
                        <IconPencil />
                        Edit Page
                    </a>
                {/if}
                <a
                    href="#top"
                    class="subtle"
                    role="button"
                    on:click={showDrawer}
                >
                    <IconFiles />
                    Revisions
                </a>
            {/if}
        </div>
        <div class="tags row-left">
            <IconTag />
            {#each data.tags as tag}
                <a href={"/?tags=" + tag} class="tag">{tag}</a>
            {/each}
        </div>
    </header>
    <section class="content">
        <MarkdownRenderer markdown={data.markdown} />
    </section>
</article>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<Drawer right {open} width="550px" on:dismiss={dismiss}>
    <div class="revisions">
        {#each data.revisions as rev, i}
            <div class="revision">
                <div
                    class="avatar"
                    class:clickable={browser}
                    on:click={(e) =>
                        showUserProfile(rev.author.id, e.clientX, e.clientY)}
                >
                    <Avatar
                        src={rev.author.avatarUrl}
                        name={rev.author.displayName}
                    />
                </div>
                <div class="revision-info">
                    <span
                        class="revision-author"
                        class:clickable={browser}
                        on:click={(e) =>
                            showUserProfile(
                                rev.author.id,
                                e.clientX,
                                e.clientY,
                            )}
                    >
                        {rev.author.displayName}
                    </span>
                    published
                    <a href="/{rev.id}">
                        Revision #{data.revisions.length - i}
                    </a>
                    <FuzzyDate date={rev.createdAt} />
                </div>
                <div class="revision-comment muted">
                    {rev.changeMessage || "No comment"}
                </div>
            </div>
        {/each}
    </div>
</Drawer>

<style>
    p.banner {
        margin-bottom: 2em;
        padding: 1em;
        background: var(--highlight);
        border-radius: var(--radius);
        line-height: 1.5;
    }

    header {
        padding: 0 0 4em;
    }

    hgroup {
        margin-bottom: 2rem;
    }

    hgroup > h1 {
        margin-bottom: 1rem;
        font-size: 3rem;
        font-weight: bold;
        font-family: var(--font-alt);
        color: var(--primary);
        line-height: 1.125;
    }

    hgroup > h2 {
        color: var(--text-muted);
        font-size: 1.5rem;
        line-height: 1.25;
    }

    .info {
        color: var(--text-muted);
        font-size: 1rem;
    }

    .info > .row-left {
        gap: 0.5rem;
    }

    .tags {
        margin-top: 0.5em;
        color: var(--text-muted);
    }

    .tag {
        font-size: 0.875em;
        padding: 0.25em 0.5em;
        border-radius: var(--radius);
        background: var(--highlight);
    }

    section {
        overflow: hidden;
    }

    @media screen and (min-width: 1100px) {
        article {
            font-size: 1.125em;
        }
    }

    .revisions {
        display: flex;
        flex-direction: column;
        padding: 2rem;
        gap: 2rem;
    }

    .clickable {
        cursor: pointer;
    }

    .revision {
        display: grid;
        gap: 0.5em;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
        grid-template-areas:
            "avatar info"
            "avatar comment";
    }

    .revision-author.clickable {
        color: var(--primary);
    }

    .avatar {
        margin-right: 0.5rem;
        grid-area: avatar;
    }

    .revision-comment {
        grid-area: comment;
        font-size: 0.875em;
        line-height: 1.5;
    }
</style>
