import { ORIGIN } from "$env/static/private";
import { LocaleCode } from "$lib/locales";
import { LATEST_VERSION } from "$lib/versions";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const user = locals.user;
    const sess = locals.session;

    return {
        theme: sess?.theme ?? "light",
        locale: sess?.locale ?? LocaleCode.English,
        version: sess?.version ?? LATEST_VERSION,
        origin: ORIGIN,
        user: user ? {
            id: user._id.toHexString(),
            displayName: user.displayName,
            email: user.email,
            avatarUrl: user.avatarUrl,
            emailPublic: user.emailPublic,
            bio: user.bio,
            socials: user.socials,
        } : null,
    };
}) satisfies LayoutServerLoad;