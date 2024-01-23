<script lang="ts">
</script>

<footer>
    <div class="container">
        <div class="ownerships">
            <p>
                <a
                    href="https://unrealengine.com"
                    target="_blank"
                    rel="noreferrer">Unreal</a
                >
                and its logo are&nbsp;
                <a href="https://epicgames.com" target="_blank" rel="noreferrer"
                    >Epic&rsquo;s</a
                > trademarks or registered trademarks in the US and elsewhere.
            </p>
            <p>
                This site is hosted by <a
                    href="https://catalystsoftworks.com"
                    target="_blank"
                    rel="noreferrer">Catalyst Softworks</a
                >, but is developed and maintained by its community. The views
                expressed here are solely those of the authors and do not
                reflect the views of Catalyst Softworks or Epic Games.
            </p>
        </div>
        <div class="links">
            <h5 class="muted">About This Site</h5>
            <!-- TODO: github link -->
            <a href="/users">Contributors</a>
            <a href="/wiki/privacy-policy">Privacy Policy</a>
            <a href="/contribute-6uep3zl8">Contribution Guide</a>
            <a href="/wiki/editor">Editor Help</a>
        </div>
        <div class="discords">
            <h5 class="muted">Need Help?</h5>
            <p>
                Need help with Unreal Engine?<br />
                <a
                    href="https://discord.gg/unreal-slackers"
                    target="_blank"
                    rel="noreferrer">Join the Unreal Slackers Discord</a
                >
            </p>
            <p>
                Need help with the Unreal Wiki?<br />
                <a
                    href="https://discord.gg/GsEw5z4"
                    target="_blank"
                    rel="noreferrer">Join the Wiki Discord</a
                >
            </p>
        </div>
    </div>
</footer>

<style>
    footer {
        background: var(--highlight);
        padding: 2rem 0;
    }

    footer h5 {
        border-top: solid 1px var(--border);
        margin-top: 2rem;
        padding-top: 2rem;
        margin-bottom: 1rem;
        font-weight: bold;
    }

    .links > a {
        display: block;
        margin-bottom: 1rem;
    }

    @media screen and (min-width: 768px) {
        footer {
            padding: 4rem 0;
        }

        footer h5 {
            border-top: none;
            margin-top: 0;
            padding-top: 0;
        }

        footer > .container {
            display: grid;
            grid-template-columns: 4fr 1fr 2fr;
            gap: 2rem;
        }
    }
</style>
