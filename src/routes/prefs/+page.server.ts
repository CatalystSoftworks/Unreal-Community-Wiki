import { usersDb } from "$lib/server/dbo";
import { patchUserSession } from "$lib/server/session";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { LOCALES } from "$lib/locales";
import { VERSIONS } from "$lib/versions";

const VERSION_NUMBERS = VERSIONS.map(v => v.number);

export const load = (async () => {
    throw redirect(302, "/");
}) satisfies PageServerLoad;


export const actions: Actions = {
    async setTheme({ request, locals, cookies }) {
        const data = await request.formData();
        const theme = data.get("theme");
        if (theme !== "light" && theme !== "dark" && theme !== "auto") {
            return { error: "Invalid theme type specified." };
        }

        const user = locals.user;
        if (user) {
            await usersDb.updateOne({ _id: user._id }, {
                $set: {
                    theme: theme,
                    updatedAt: new Date(),
                },
            });
        }

        await patchUserSession(cookies, {
            theme: theme,
        });

        redirectBack(request);

        return { message: "Successfully updated theme." };
    },
    async setLocale({ request, locals, cookies }) {
        const data = await request.formData();
        const locale = data.get("locale");
        if (typeof locale !== "string" || !LOCALES.includes(locale)) {
            return { error: "Invalid locale specified." };
        }

        const user = locals.user;
        if (user) {
            await usersDb.updateOne({ _id: user._id }, {
                $set: {
                    localeCode: locale,
                    updatedAt: new Date(),
                },
            });
        }

        await patchUserSession(cookies, {
            locale: locale,
        });

        redirectBack(request);

        return { message: "Successfully updated locale." };
    },
    async setVersion({ request, locals, cookies }) {
        const data = await request.formData();
        let version = data.get("version") as unknown;

        if (typeof version === "string") {
            version = parseFloat(version);
        }

        if (typeof version !== "number") {
            return { error: "A valid version number must be specified." };
        }

        if (!VERSION_NUMBERS.includes(version)) {
            return { error: "Given version number is not supported." };
        }

        const user = locals.user;
        if (user) {
            await usersDb.updateOne({ _id: user._id }, {
                $set: {
                    version: version,
                    updatedAt: new Date(),
                },
            });
        }

        await patchUserSession(cookies, {
            version: version,
        });

        redirectBack(request);

        return { message: "Successfully updated version." };
    },
};

/**
 * Redirects the user back to the previous page.
 */
function redirectBack(request: Request) {
    const referer = request.headers.get("referer");
    if (referer) {
        throw redirect(302, referer);
    }
}