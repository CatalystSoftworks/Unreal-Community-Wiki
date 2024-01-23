import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import matter from "gray-matter";

// export const prerender = true;

const STATIC_PAGES = import.meta.glob("../../../../pages/*.md", { eager: true, as: "raw" });

// export const entries: EntryGenerator = async () => {
//     const entries = [];

//     for (const path of Object.keys(STATIC_PAGES)) {
//         entries.push({
//             file: path.replace("../../../../pages/", "").replace(".md", ""),
//         });
//     }

//     return entries;
// };

export const load = (async ({ params }) => {
    const page = STATIC_PAGES[`../../../../pages/${params.file}.md`];
    if (!page) {
        throw error(404, "Not found");
    }

    const { data, content } = matter(page);

    return {
        meta: data,
        page: content,
    };
}) satisfies PageServerLoad;