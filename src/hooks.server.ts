import { sequence } from "@sveltejs/kit/hooks";
import * as Sentry from "@sentry/sveltekit";
import { redirect, type Handle } from "@sveltejs/kit";
import { NODE_ENV, ORIGIN } from "$env/static/private";
import { getUserSession } from "$lib/server/session";
import { usersDb } from "$lib/server/dbo";
import { PUBLIC_SENTRY_DSN, PUBLIC_SENTRY_TRACE_SAMPLE_RATE } from "$env/static/public";
import { dev } from "$app/environment";

Sentry.init({
    dsn: PUBLIC_SENTRY_DSN,
    environment: NODE_ENV,
    debug: dev,
    enabled: !ORIGIN.includes("localhost"),
    tracesSampleRate: parseFloat(PUBLIC_SENTRY_TRACE_SAMPLE_RATE || "1.0"),
});

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
    const { cookies } = event;

    const sess = await getUserSession(cookies);
    event.locals.session = sess;

    if (sess.userId) {
        const user = await usersDb.findOne({ _id: sess.userId, deletedAt: null });
        if (user) {
            event.locals.user = user;
        }
    }

    if (event.route.id?.includes("(auth)")) {
        if (!event.locals.user) {
            throw redirect(302, "/login?redirect=/me");
        }
    }

    return resolve(event, {
        transformPageChunk({ html }) {
            return html
                .replace("%wiki_theme%", sess.theme)
                .replace("%wiki_locale%", sess.locale);
        },
    });
});

/** Handles errors at the server level. */
export const handleError = Sentry.handleErrorWithSentry();