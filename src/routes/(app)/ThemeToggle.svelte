<script lang="ts">
    import { notify } from "$lib/notifications";
    import { enhance } from "$app/forms";
    import type { LayoutData } from "./$types";
    import type { SubmitFunction } from "../prefs/$types";
    import IconMoon from "$lib/icons/moon.svg?component";
    import IconSun from "$lib/icons/sun.svg?component";

    export let theme: LayoutData["theme"];

    $: nextTheme = theme === "dark" ? "light" : "dark";
    let submitting = false;

    const onsubmit: SubmitFunction = ({}) => {
        submitting = true;

        return async ({ result }) => {
            const err =
                result.type === "error" ||
                result.type === "failure" ||
                "error" in result;

            if (err) {
                notify({
                    message: "Something went wrong while updating your theme.",
                    error: true,
                });
            } else {
                theme = nextTheme as LayoutData["theme"];
                document.documentElement.dataset.theme = theme;
                notify({ message: "Theme was successfully updated." });
            }

            submitting = false;
        };
    };
</script>

<form action="/prefs?/setTheme" method="POST" use:enhance={onsubmit}>
    <input type="hidden" name="theme" value={nextTheme} />
    <button
        type="submit"
        class="icon subtle"
        title="Toggle Theme"
        aria-label="Toggle Theme"
        aria-busy={submitting}
    >
        {#if !submitting}
            {#if theme === "dark"}
                <IconMoon size={24} />
            {:else}
                <IconSun size={24} />
            {/if}
        {/if}
    </button>
</form>
