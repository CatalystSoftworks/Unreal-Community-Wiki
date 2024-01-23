import { env } from "$env/dynamic/private";
import { LocaleCode } from "$lib/locales";
import { LATEST_VERSION } from "$lib/versions";
import type { Cookies } from "@sveltejs/kit";
import * as iron from "@hapi/iron";
import { ObjectId } from "mongodb";

/** The name of the cookie. */
const COOKIE_NAME = "uewiki_sess";

/** The max age that the cookie will be valid for. */
const MAX_AGE = 60 * 60 * 24 * 15; // 15 days

/** Defines the type of data stored in a session. */
export interface SessionData {
    /** ID of the user associated with the session (if any). */
    userId: null | ObjectId;
    /** The locale code used for the current session. */
    locale: string;
    /** The desired version number to use for the current session (if any). */
    version: number;
    /** The desired theme for the current session. */
    theme: "light" | "dark" | "auto";
}

/** Defines the default session data returned if an existing session can't be found. */
const DEFAULT_SESSION: SessionData = {
    userId: null,
    version: LATEST_VERSION,
    locale: LocaleCode.English,
    theme: "auto",
};


/** Destroys a session cookie, effectively acting like a log out. */
export function clearUserSession(cookies: Cookies) {
    return setUserSession(cookies, DEFAULT_SESSION);
}

/** Signs and seals session data into a cookie that is then sent back via the response object. */
export async function setUserSession(cookies: Cookies, session: SessionData) {
    if (!env.TOKEN_SECRET) {
        console.warn("TOKEN_SECRET not set, sessions disabled.");
        return;
    }

    const createdAt = Date.now();
    // Create a session object with a max age that we can validate later
    const obj: any = { ...session, createdAt, maxAge: MAX_AGE };
    if (session.userId) {
        obj.userId = session.userId.toHexString();
    }

    console.log(env.TOKEN_SECRET)

    const token = await iron.seal(obj, env.TOKEN_SECRET, iron.defaults);

    cookies.set(COOKIE_NAME, token, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}

/**
 * Updates the session data stored in the cookie found on the given request object, if there is one.
 * Performs the operation as a patch, leaving any properties not specified in the given session
 * object unchanged.
 */
export async function patchUserSession(cookies: Cookies, session: Partial<SessionData>) {
    const existing = await getUserSession(cookies);
    return setUserSession(cookies, { ...existing, ...session });
}

/**
 * Attempts to retrieve and return the session data stored in the cookie found on the given
 * request object, if there is one.
 */
export async function getUserSession(cookies: Cookies): Promise<SessionData> {
    try {
        const token = cookies.get(COOKIE_NAME);

        if (!env.TOKEN_SECRET || !token) {
            return DEFAULT_SESSION;
        }

        const session = await iron.unseal(token, env.TOKEN_SECRET, iron.defaults);
        const expiresAt = session.createdAt + session.maxAge * 1000;

        // Validate the expiration date of the session
        if (Date.now() > expiresAt) {
            // clear the cookie if it's expired
            clearUserSession(cookies);
            return DEFAULT_SESSION;
        }

        if (session.userId) {
            session.userId = new ObjectId(session.userId);
        }

        return session;
    } catch (err) {
        console.error("Failed to parse session from cookie.");
        return DEFAULT_SESSION;
    }
}