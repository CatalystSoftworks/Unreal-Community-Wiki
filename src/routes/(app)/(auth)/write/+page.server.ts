import { ObjectId } from "mongodb";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { pagesDb, revisionsDb } from "$lib/server/dbo";

export const load = (async ({ url }) => {
    // get all tags from the database
    const tags = (await pagesDb.distinct("tags")).filter(t => !!t);

    // were we given a revision ID to start from?
    const revId = url.searchParams.get("rev");
    if (revId) {
        if (!ObjectId.isValid(revId)) {
            throw error(400, "Invalid revision ID");
        }

        const rev = await revisionsDb.findOne({ _id: new ObjectId(revId) });
        if (!rev) {
            throw error(404, "Revision not found");
        }

        return {
            tags,
            page: {
                revId: revId,
                title: rev.title,
                description: rev.description,
                tags: rev.tags,
                markdown: rev.markdown,
            },
        };
    }

    return { tags };
}) satisfies PageServerLoad;