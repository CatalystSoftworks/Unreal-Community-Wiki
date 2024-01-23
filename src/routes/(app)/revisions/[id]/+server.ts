import { redirect } from "@sveltejs/kit";

// redirect for legacy URLs
export const GET = (async ({ params }) => {
    throw redirect(301, `/${params.id}`);
});