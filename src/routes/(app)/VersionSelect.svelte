<script lang="ts">
    import { notify } from "$lib/notifications";
    import { enhance } from "$app/forms";
    import type { LayoutData } from "./$types";
    import { VERSIONS } from "$lib/versions";
    import NavLink from "./NavLink.svelte";
    import Drawer from "$lib/components/Drawer.svelte";
    import type { SubmitFunction } from "../prefs/$types";
    import IconGitMerge from "$lib/icons/git-merge.svg?component";

    export let version: LayoutData["version"];

    let submitting = false;
    let showOptions = false;

    const onsubmit: SubmitFunction = ({ formData }) => {
        submitting = true;
        let nextVersion = formData.get("version") as string | number;
        if (typeof nextVersion === "string") {
            nextVersion = parseFloat(nextVersion);
        }

        return async ({ result }) => {
            const err =
                result.type === "error" ||
                result.type === "failure" ||
                "error" in result;

            if (err) {
                notify({
                    message:
                        "Something went wrong while updating your version.",
                    error: true,
                });
            } else {
                version = nextVersion as LayoutData["version"];
                notify({ message: `Set version to v${version.toFixed(2)}` });
                // trigger a generic event on the window with the updated version number
                document.dispatchEvent(
                    new CustomEvent("versionchange", {
                        detail: version,
                    }),
                );
                showOptions = false;
            }

            submitting = false;
        };
    };

    function toggle(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        if (submitting) return;
        showOptions = !showOptions;
    }

    function dismiss() {
        if (submitting) return;
        showOptions = false;
    }
</script>

<NavLink
    href="#top"
    icon={IconGitMerge}
    label="v{version.toFixed(2)}"
    title="Select Unreal Version"
    on:click={toggle}
/>

<Drawer width="280px" open={showOptions} on:dismiss={dismiss}>
    <form action="/prefs?/setVersion" method="POST" use:enhance={onsubmit}>
        <menu>
            <header>
                <p class="muted">
                    Select a version to view the documentation for that version.
                </p>
            </header>

            {#each VERSIONS as v}
                <button
                    type="submit"
                    class="subtle"
                    class:active={v.number === version}
                    disabled={submitting}
                    name="version"
                    value={v.number}
                    title="Select Version {v.number.toFixed(2)}"
                    aria-label="Select Version {v.number.toFixed(2)}"
                >
                    {v.number.toFixed(2)}
                </button>
            {/each}
        </menu>
    </form>
</Drawer>

<style>
    button {
        width: 100%;
        text-align: left;
        justify-content: flex-start;
    }

    button.active {
        font-weight: bold;
        background: var(--primary);
        color: var(--on-primary);
    }

    menu {
        padding: 2em;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    header {
        margin-bottom: 2em;
    }

    p {
        line-height: 1.5;
    }
</style>
