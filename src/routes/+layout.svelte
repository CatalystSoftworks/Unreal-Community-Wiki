<script lang="ts">
    import "../global.css";
    import PageLoader from "./PageLoader.svelte";
    import Toaster from "./Toaster.svelte";
    import UserProfilePopup from "./UserProfilePopup.svelte";
</script>

<slot />

<Toaster />
<UserProfilePopup />
<PageLoader />
