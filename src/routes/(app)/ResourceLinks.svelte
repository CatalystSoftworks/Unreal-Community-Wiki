<script lang="ts">
    import NavGroup from "./NavGroup.svelte";
    import NavLink from "./NavLink.svelte";
    import IconSpy from "$lib/icons/spy.svg?component";
    import IconBuildingLighthouse from "$lib/icons/building-lighthouse.svg?component";
    import IconPencilQuestion from "$lib/icons/pencil-question.svg?component";
    import IconBrandGithub from "$lib/icons/brand-github.svg?component";
    import IconUnrealSource from "$lib/icons/brand-unreal-source.svg?component";
    import IconUnreal from "$lib/icons/brand-unreal.svg?component";
    import IconUnrealAnswers from "$lib/icons/brand-unreal-answers.svg?component";

    export let uri: string;
</script>

<NavGroup label="Unreal Resources">
    <NavLink
        label="Unreal Docs"
        href="https://docs.unrealengine.com"
        icon={IconUnreal}
    />
    <NavLink
        label="Unreal Answers"
        href="https://answers.unrealengine.com"
        icon={IconUnrealAnswers}
    />
    <NavLink
        label="Unreal Source"
        href="https://unrealsource.com/"
        icon={IconUnrealSource}
    />
</NavGroup>

<NavGroup label="About This Site">
    <NavLink
        label="Source Code"
        href="https://github.com/catalystsoftworks/unreal-community-wiki"
        icon={IconBrandGithub}
    />
    <NavLink
        label="Privacy Policy"
        href="/wiki/privacy-policy"
        active={uri === "/wiki/privacy-policy"}
        icon={IconSpy}
    />
    <NavLink
        label="Contribution Guide"
        href="/contribute-6uep3zl8"
        active={uri === "/contribute-6uep3zl8"}
        icon={IconBuildingLighthouse}
    />
    <NavLink
        label="Editor Help"
        href="/wiki/editor"
        active={uri === "/wiki/editor"}
        icon={IconPencilQuestion}
    />
    <!--             
            <a href="/users">Contributors</a>
            <a href="/wiki/privacy-policy">Privacy Policy</a>
            <a href="/contribute-6uep3zl8">Contribution Guide</a>
            <a href="/wiki/editor">Editor Help</a>

            <a
            href="https://discord.gg/unreal-source"
            target="_blank"
            rel="noreferrer">Join the Unreal Source Discord</a
        >
    </p>
    <p>
        Need help with the Unreal Wiki?<br />
        <a
            href="https://discord.gg/GsEw5z4"
            target="_blank"
            rel="noreferrer">Join the Wiki Discord</a
        > -->
</NavGroup>
