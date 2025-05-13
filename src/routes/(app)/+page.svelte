<script lang="ts">
    import FuzzyDate from "$lib/components/FuzzyDate.svelte";
    import Dropdown from "$lib/components/Dropdown.svelte";
    import type { PageData } from "./$types";
    import IconSearch from "$lib/icons/search.svg?component";
    import IconArrowsSort from "$lib/icons/arrows-sort.svg?component";
    import IconTag from "$lib/icons/tag.svg?component";
    import IconCalendar from "$lib/icons/calendar.svg?component";
    import IconArrowLeft from "$lib/icons/arrow-left.svg?component";
    import IconArrowRight from "$lib/icons/arrow-right.svg?component";
    import Head from "$lib/components/Head.svelte";
    import AdCard from "$lib/components/AdCard.svelte";

    export let data: PageData;

    $: tagmap = data.tags.reduce(
        (acc, tag) => {
            acc[tag] = tag;
            return acc;
        },
        {} as Record<string, string>
    );
</script>

<Head
    description="The Unreal Community Wiki is a community-driven resource for developing games, software, and media using Unreal Engine."
    url={data.origin}
/>

<header class="shadow">
    <form method="GET" class="row filters">
        <label for="search" class="row" title="Search">
            <IconSearch />
            <input
                id="search"
                type="search"
                name="query"
                placeholder="Search..."
                value={data.query}
            />
        </label>
        <menu class="row">
            <Dropdown
                icon={IconArrowsSort}
                items={{
                    updated_desc: "Recently Updated",
                    created_desc: "Recently Created",
                    // likes_desc: "Most Liked",
                    revisions_desc: "Most Revisions",
                }}
                selected={data.sort}
                name="sort"
                placeholder="Sort By"
            />
            <Dropdown
                icon={IconTag}
                items={tagmap}
                selected={data.selectedTags}
                name="tags"
                placeholder="Tag"
            />
        </menu>
        <button type="submit" class="primary sm" title="Apply Filters">
            Apply
        </button>
    </form>
</header>

<section>
    <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
    {#each data.articles as result}
        <a href="/{result.path}" class="card">
            <h3>{result.title}</h3>
            <p class="summary muted">{result.description}</p>
            <div class="meta row muted sm h-left">
                <div class="last-updated row-left">
                    <IconCalendar />
                    <FuzzyDate date={result.lastUpdated} />
                </div>
                <!-- <div class="likes">
                    {result.likes}
                    {result.likes === 1 ? "like" : "likes"}
                </div> -->
                <div class="tags row">
                    {#each result.tags as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
            </div>
        </a>
    {:else}
        <p class="empty lg">No results found.</p>
    {/each}
</section>

{#if data.articles.length > 0}
    <section class="pagination">
        {#if data.previousPageUrl}
            <a href={data.previousPageUrl} class="icon page-prev" role="button">
                <IconArrowLeft />
            </a>
        {/if}

        <span class="muted page">
            Page {data.page} of {data.pageCount}
        </span>

        {#if data.nextPageUrl}
            <a href={data.nextPageUrl} class="icon page-next" role="button">
                <IconArrowRight />
            </a>
        {/if}
    </section>
{/if}

<AdCard />

<style>
    header {
        margin-bottom: 3rem;
        padding: 0.5em;
        background: var(--fg);
        border-radius: var(--radius);
    }

    a.card {
        display: block;
        line-height: 1.5;
    }

    .card:first-child {
        margin-top: 0;
    }

    .card:last-child {
        margin-bottom: 0;
    }

    .card > h3 {
        margin-bottom: 0.5rem;
    }

    .summary {
        margin-bottom: 1rem;
    }

    .meta {
        gap: 2rem;
    }

    .tags {
        position: relative;
        justify-content: flex-start;
        flex-wrap: nowrap;
        overflow: hidden;
        gap: 0.5rem;
        flex: 1;
    }

    .tags:after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 20%;
        background: linear-gradient(to right, transparent, var(--fg));
    }

    .tag {
        background: var(--highlight);
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius);
        white-space: nowrap;
    }

    label[for="search"] {
        position: relative;
        flex: 1;
        margin: 0 1rem 0 0;
        padding: 0 0.5rem;
        height: var(--ctrl-height);
        gap: 0;
    }

    input {
        flex: 1;
        background: transparent;
    }

    .empty {
        padding: 3rem 0;
        text-align: center;
    }

    .pagination {
        margin-top: 3rem;
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 1rem;
        align-items: center;
        grid-template-areas: "prev page next";
    }

    .page-prev {
        grid-area: prev;
    }

    .page {
        grid-area: page;
        text-align: center;
    }

    .page-next {
        grid-area: next;
    }
</style>
