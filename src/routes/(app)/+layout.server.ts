import type { LayoutServerLoad } from "./$types";

export const load = (async ({ url }) => {
    return {
        uri: url.pathname + url.search,
    };
}) satisfies LayoutServerLoad;