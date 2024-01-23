<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let value: string;

    function onkeydown(e: KeyboardEvent, i: number) {
        if ((e.key === "v" && (e.ctrlKey || e.metaKey)) || e.key === "Tab") {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const target = e.target as HTMLInputElement;

        switch (e.key) {
            case "ArrowLeft": {
                const prevInput =
                    target.previousElementSibling as HTMLInputElement;
                if (prevInput) {
                    prevInput.focus();
                }
                break;
            }
            case "ArrowRight": {
                const nextInput = target.nextElementSibling as HTMLInputElement;
                if (nextInput) {
                    nextInput.focus();
                }
                break;
            }
            case "Backspace":
                if (i > 0) {
                    value = value.slice(0, i - 1) + value.slice(i);
                    const prevInput =
                        target.previousElementSibling as HTMLInputElement;
                    if (prevInput) {
                        prevInput.focus();
                    }
                } else {
                    value = "";
                }
                dispatch("change", { value });
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9": {
                value = value.slice(0, i) + e.key + value.slice(i + 1);
                const nextInput = target.nextElementSibling as HTMLInputElement;
                if (nextInput) {
                    nextInput.focus();
                    dispatch("change", { value });
                } else {
                    target.blur();
                    dispatch("complete", { value });
                }
                break;
            }
        }
    }

    function onpaste(e: ClipboardEvent) {
        e.preventDefault();
        const pasted = e.clipboardData?.getData("text/plain");
        if (pasted) {
            value = pasted.slice(0, 6);
            if (value.length >= 6) {
                dispatch("complete", { value });
            } else {
                dispatch("change", { value });
            }
        }
    }
</script>

<div class="pin">
    {#each { length: 6 } as _, i}
        <input
            type="text"
            maxlength="1"
            bind:value={value[i]}
            on:keydown={(e) => onkeydown(e, i)}
            on:paste={onpaste}
        />
    {/each}
</div>

<style>
    .pin {
        position: relative;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 0.5em;
        font-size: 1.25em;
    }

    .pin > input {
        padding: 0;
        text-align: center;
        outline: solid 2px var(--border);
        min-width: 0;
        width: var(--ctrl-height);
        max-width: var(--ctrl-height);
        height: var(--ctrl-height);
    }

    .pin > input:focus {
        outline-color: var(--primary);
    }
</style>
