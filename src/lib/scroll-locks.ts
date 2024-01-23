import { onDestroy } from "svelte";
import { browser } from "$app/environment";

const scrollLocks: symbol[] = [];

/**
 * Creates a scroll lock for the browser that will be removed when the
 * owning component is destroyed.
 */
export function useScrollLock() {
    if (!browser) {
        return { lock: noop, unlock: noop };
    }

    const KEY = Symbol();

    function lock() {
        if (KEY in scrollLocks) {
            return;
        }

        if (scrollLocks.length === 0) {
            document.body.style.overflow = "hidden";
        }

        scrollLocks.push(KEY);
    }

    function unlock() {
        const index = scrollLocks.indexOf(KEY);
        if (index === -1) return;
        scrollLocks.splice(index, 1);

        if (scrollLocks.length === 0) {
            document.body.style.overflow = "";
        }
    }

    onDestroy(() => unlock());

    return { lock, unlock };
}

function noop() {
    // Do nothing
}