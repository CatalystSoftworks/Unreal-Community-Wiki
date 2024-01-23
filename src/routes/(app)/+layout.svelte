<script lang="ts">
    import { onMount } from "svelte";
    import ResourceLinks from "./ResourceLinks.svelte";
    import type { LayoutData } from "./$types";
    import Avatar from "$lib/components/Avatar.svelte";
    import ThemeToggle from "./ThemeToggle.svelte";
    import VersionSelect from "./VersionSelect.svelte";
    import NavGroup from "./NavGroup.svelte";
    import NavLink from "./NavLink.svelte";
    import IconWikiLogo from "$lib/icons/wiki-logo.svg?component";
    import IconManny from "$lib/icons/manny.svg?component";
    import IconFilePlus from "$lib/icons/file-plus.svg?component";
    import IconHome from "$lib/icons/home.svg?component";
    import IconLayoutSidebarLeftCollapse from "$lib/icons/layout-sidebar-left-collapse.svg?component";
    import IconLayoutSidebarLeftExpand from "$lib/icons/layout-sidebar-left-expand.svg?component";
    import IconMenu from "$lib/icons/menu-2.svg?component";
    // import IconSearch from "$lib/icons/search.svg?component";
    // import IconUsers from "$lib/icons/users.svg?component";
    // import IconTag from "$lib/icons/tag.svg?component";

    export let data: LayoutData;

    let showNavDesktop = true;
    let showNavMobile = false;

    $: uri = data.uri;
    $: user = data.user;
    $: theme = data.theme;

    onMount(() => {
        if (localStorage.getItem("wiki_sidenav") === "false") {
            showNavDesktop = false;
        }
    });

    function toggleNavDesktop(e: Event) {
        e.preventDefault();
        showNavDesktop = !showNavDesktop;
        localStorage.setItem("wiki_sidenav", showNavDesktop.toString());
    }

    function toggleNavMobile(e: Event) {
        e.preventDefault();
        showNavMobile = !showNavMobile;
    }

    function openSearch(e: Event) {
        e.preventDefault();
        // TODO: open search
    }

    function closeNav(e: Event) {
        e.preventDefault();
        showNavDesktop = false;
        showNavMobile = false;
    }
</script>

<!-- <Searchbox /> -->

<nav class:show-desktop={showNavDesktop} class:show-mobile={showNavMobile}>
    <header class="row">
        {#if user}
            <a href="/me" class="row-left user-link" title="Profile Settings">
                <Avatar
                    name={user.displayName}
                    src={user.avatarUrl}
                    size={32}
                />
                <span class="ellipsis">{user.displayName}</span>
            </a>
        {:else}
            <a href="/login" class="row-left user-link" title="Login">
                <IconManny size={32} />
                <!-- <Logo size={32} /> -->
                <span class="ellipsis">Guest</span>
            </a>
        {/if}

        <div class="row">
            <ThemeToggle {theme} />
            <button
                class="icon subtle"
                title="Hide Sidebar"
                on:click={closeNav}
            >
                <IconLayoutSidebarLeftCollapse />
            </button>
        </div>
    </header>

    <!-- <a href="/" class="logo" title="Unreal Community Wiki">
        <Logo />
    </a> -->

    <section class="items-wrapper flex-1 scroll-y">
        <section class="items flex-1">
            <VersionSelect version={data.version} />

            <NavLink
                label="New Page"
                href="/write"
                active={uri === "/write"}
                icon={IconFilePlus}
            />

            <NavGroup>
                <NavLink
                    label="Home"
                    href="/"
                    active={uri === "/"}
                    icon={IconHome}
                />
                <!-- <NavLink
                label="Search"
                href="/search"
                active={uri === "/search"}
                icon={IconSearch}
                on:click={openSearch}
            /> -->
                <!-- <NavLink
                label="Tags"
                href="/tags"
                active={uri.startsWith("/tags")}
                icon={IconTag}
            /> -->
                <!-- <NavLink
                label="Contributors"
                href="/users?sort=contributions"
                active={uri.startsWith("/users")}
                icon={IconUsers}
            /> -->
            </NavGroup>

            <ResourceLinks {uri} />
        </section>

        <section class="brand">
            <IconWikiLogo />
        </section>

        <footer class="disclaimers">
            <p>
                <a
                    href="https://unrealengine.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    Unreal
                </a>
                and its logo are
                <a
                    href="https://epicgames.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    Epic&rsquo;s
                </a>
                trademarks or registered trademarks in the US and elsewhere. This
                site is hosted by
                <a
                    href="https://catalystsoftworks.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    Catalyst Softworks
                </a>
                , but is developed and maintained by its community.
            </p>
        </footer>
    </section>
</nav>

<main>
    <header class="desktop-header">
        <button
            class="icon desktop-nav-toggle"
            class:showing={showNavDesktop}
            on:click={toggleNavDesktop}
            title="Show Sidebar"
        >
            <IconLayoutSidebarLeftExpand />
        </button>
    </header>

    <header class="mobile-header">
        <a href="#nav" class="mobile-nav-toggle" on:click={toggleNavMobile}>
            <IconMenu />
        </a>
    </header>

    <section class="content">
        <div class="container">
            <slot />
        </div>
    </section>
</main>

<style>
    main {
        width: 100vw;
        min-height: 100vh;
        padding-top: 0.1px;
        padding-bottom: 0.1px;
    }

    .desktop-header,
    .mobile-header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 30;
    }

    .mobile-header {
        right: 0;
        justify-content: flex-end;
        gap: 1rem;
        padding: 0.5em;
    }

    .mobile-header:before {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        content: "";
        background: var(--bg);
        opacity: 0.75;
    }

    .mobile-nav-toggle {
        position: relative;
        z-index: 2;
        color: inherit;
        padding: 1em;
    }

    .mobile-nav-toggle > :global(svg) {
        width: 2rem;
        height: auto;
    }

    .user-link {
        padding: 0.25em 1em 0.25em 0.5em;
        border-radius: var(--radius);
        color: inherit;
        font-weight: bold;
        gap: 0.5em;
    }

    .user-link:hover {
        background: var(--highlight);
    }

    .items-wrapper {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        height: 100%;
    }

    nav {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        width: 260px;
        --gap: 0;
        --highlight: var(--nav-highlight);
        background: var(--nav-bg);
        color: var(--nav-text);
        z-index: 50;
        display: grid;
        grid-template-rows: auto 1fr;
        transform: translateX(-100%);
        transition: transform 0.2s ease-in-out 0.1s;
    }

    nav > header {
        padding: 1rem;
    }

    nav > section {
        padding: 1rem;
    }

    .content {
        position: relative;
        flex: 1;
        margin: 0;
        padding: 2rem 0;
        min-height: 100vh;
    }

    footer {
        font-size: 0.875em;
        margin: 0;
        padding: 1rem;
        border-radius: var(--radius);
        background: var(--highlight);
        line-height: 1.5;
    }

    footer a {
        color: inherit;
        font-weight: bold;
    }

    .brand {
        margin: 4em 0 2em;
        display: flex;
        place-content: center;
        place-items: center;
    }

    .brand > :global(svg) {
        width: 5rem;
        height: auto;
        max-width: 100%;
    }

    @media screen and (max-width: 767px) {
        .content {
            margin-top: 4rem;
            min-height: calc(100vh - 4rem);
        }

        .desktop-header {
            display: none;
        }

        nav.show-mobile {
            transform: translateX(0);
        }
    }

    @media screen and (min-width: 768px) {
        .mobile-header {
            display: none;
        }

        .desktop-nav-toggle {
            top: 1rem;
            left: 1rem;
            color: inherit;
            opacity: 0.5;
            transition: opacity 0.2s ease-in-out;
        }

        .desktop-nav-toggle:hover {
            opacity: 1;
        }

        .desktop-nav-toggle.showing {
            opacity: 0;
        }

        nav.show-desktop {
            transform: translateX(0);
        }

        main {
            transition: padding-left 0.2s ease-in-out 0.2s;
            padding-left: 3rem;
        }

        nav.show-desktop + main {
            padding-left: 260px;
            transition-delay: 0;
        }
    }

    @media screen and (min-width: 1200px) {
        main {
            padding-left: 0;
        }
    }
</style>
