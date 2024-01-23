import { pagesDb } from "$lib/server/dbo";
import type { PageServerLoad } from "./$types";
import type { Filter, Sort } from "mongodb";
import { tryGetNum } from "$lib/formatting";


// allowed sort parameters
const SORT = {
    updated_asc: "Oldest Updated",
    updated_desc: "Recently Updated",
    created_asc: "Oldest Created",
    created_desc: "Recently Created",
    likes_asc: "Least Liked",
    likes_desc: "Most Liked",
    revisions_asc: "Least Revisions",
    revisions_desc: "Most Revisions",
};

function getSortObject(sortParam: string): Sort & { score?: { $meta: "textScore" } } {
    const param = sortParam.slice(0, sortParam.indexOf("_"));
    const sortDir = sortParam.endsWith("_asc") ? 1 : -1;
    switch (param) {
        case "updated":
            return { updatedAt: sortDir };
        case "created":
            return { createdAt: sortDir };
        case "likes":
            return { likes: sortDir };
        case "revisions":
            return { revisionCount: sortDir };
        default:
            return { updatedAt: -1 };
    }
}

export const load = (async ({ url }) => {
    let sortParam = url.searchParams.get("sort") || "";
    if (!Object.keys(SORT).includes(sortParam)) {
        sortParam = "updated_desc";
    }

    const queryParam = url.searchParams.get("query");
    const tagsParam = url.searchParams.getAll("tags");
    const pageParam = Math.floor(tryGetNum(url.searchParams.get("page"), 1));
    const limitParam = Math.floor(tryGetNum(url.searchParams.get("limit"), 25));
    const offset = Math.max(0, (pageParam - 1) * limitParam);

    const filter: Filter<DBO.Page> = { deletedAt: null };
    const sort = getSortObject(sortParam);

    const allTags = await pagesDb.distinct("tags");

    if (queryParam) {
        filter.$text = {
            $search: queryParam,
            $caseSensitive: false,
            $diacriticSensitive: false,
        };
        sort.score = { $meta: "textScore" };
    }

    if (tagsParam.length > 0) {
        filter.tags = { $all: tagsParam };
    }

    const cursor = await pagesDb.aggregate<{
        total: [{ count: number }],
        tags: { tag: string }[],
        articles: DBO.Page[],
    }>([
        { $match: filter },
        {
            $facet: {
                // get the total number of pages that match the criteria
                total: [
                    { $count: "count" },
                ],
                // get the pages that match the criteria
                articles: [
                    { $sort: sort },
                    { $skip: offset },
                    { $limit: limitParam },
                    { $project: { _id: 0, title: 1, description: 1, path: 1, tags: 1, updatedAt: 1 } },
                ],
            },
        },
    ]);

    const result = (await cursor.next()) ?? { total: [{ count: 0 }], tags: [], articles: [] };
    await cursor.close();
    const total = result.total[0]?.count ?? 0;

    let nextPageUrl = "";
    let previousPageUrl = "";

    if (offset + limitParam < total) {
        const nextUrl = new URL(url.href);
        nextUrl.searchParams.set("page", (pageParam + 1).toString());
        nextPageUrl = nextUrl.toString();
    }

    if (offset > 0) {
        const previousUrl = new URL(url.href);
        previousUrl.searchParams.set("page", (pageParam - 1).toString());
        previousPageUrl = previousUrl.toString();
    }

    return {
        sort: sortParam || "recent",
        query: queryParam || "",
        selectedTags: tagsParam,
        tags: allTags.filter(t => !!t),
        nextPageUrl,
        previousPageUrl,
        pageCount: Math.ceil(total / limitParam),
        limit: limitParam,
        page: pageParam,
        articles: result.articles.map((a) => ({
            title: a.title,
            description: a.description,
            path: a.path,
            tags: a.tags,
            lastUpdated: a.updatedAt.toString(),
            likes: a.likes || 0,
        })),
    };
}) satisfies PageServerLoad;