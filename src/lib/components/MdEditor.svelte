<script lang="ts">
    import { Carta, CartaEditor } from "carta-md";
    import { code } from "@cartamd/plugin-code";
    import { attachment } from "@cartamd/plugin-attachment";
    import { slash } from "@cartamd/plugin-slash";
    import { anchor } from "@cartamd/plugin-anchor";
    import { sanitize } from "isomorphic-dompurify";
    import "carta-md/dark.css";
    import "./md-editor.scss";

    const carta = new Carta({
        extensions: [
            code(),
            attachment({
                async upload() {
                    return "https://picsum.photos/200/300";
                },
            }),
            slash(),
            anchor(),
        ],
        rendererDebounce: 250,
        sanitizer: sanitize,
    });

    let value = "";
</script>

<div class="editor">
    <CartaEditor {carta} bind:value />
</div>

<style>
    .editor {
        height: 100vh;
    }
</style>
