import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * This endpoint is a redirect to allow historical search results to
 * map to the new endpoint.
 * 
 * /tag/:tag -> /?tags=:tag
 * /search/:term -> /?query=:term
 * 
 * Page params carry through as page and limit.
 */
export const GET = (async ({ url, params }) => {

    const newUrl = new URL(url);
    newUrl.pathname = "/";

    // map URI segments to the new query params
    const parts = params.path.split("/");
    if (parts.length > 0) {
        switch (parts[0]) {
            case "tag":
                newUrl.searchParams.set("tags", parts[1]);
                break;
            case "search":
                newUrl.searchParams.set("query", parts[1]);
                break;
        }
    }

    // redirect to the new URL as a permanent redirect
    throw redirect(301, newUrl.toString());
}) satisfies RequestHandler;