import { z } from "zod";
import { userSessionsDb, usersDb } from "$lib/server/dbo";
import crypto from "crypto";
import { setUserSession } from "$lib/server/session";
import { LATEST_VERSION } from "$lib/versions";
import { LocaleCode } from "$lib/locales";
import type { Actions, PageServerLoad } from "./$types";
import { ObjectId } from "mongodb";
import { sendEmail } from "$lib/server/mailer";
import { ORIGIN } from "$env/static/private";
import { redirect, type Cookies } from "@sveltejs/kit";
import { dev } from "$app/environment";

export const load: PageServerLoad = async ({ request, url, cookies }) => {
    const email = url.searchParams.get("email");
    const pin = url.searchParams.get("pin");

    let error: string | undefined;

    // if both the email and pin are provided, then try to login the
    // user with the given credentials
    if (email && pin) {
        const res = await verify({ input: { email, pin }, cookies, request });
        if (res.error) {
            error = res.error;
        }
    }

    return { email, pin, error };
};

export const actions: Actions = {
    async request({ request }) {
        const data = await request.formData();

        const validation = z.string().email().safeParse(data.get("email"));
        if (!validation.success) {
            return { error: validation.error.issues[0].message };
        }

        const email = validation.data.toLowerCase().trim();

        await _requestCode(email, request);

        return { pinSent: true, email };
    },
    async verify({ request, cookies }) {
        const data = await request.formData();
        const email = data.get("email") as string;
        const pin = data.get("pin") as string;
        return verify({ input: { email, pin }, cookies, request });
    },
};

/**
 * Sends a pin code to the user's email address.
 */
export async function _requestCode(email: string, request: Request) {
    const user = await usersDb.findOne({ email, deletedAt: null });
    if (!user) {
        return { error: "Failed to login with the given credentials." };
    }

    // generate a six digit pin code for the user
    const token = generateSecurePin();

    const sess: DBO.UserSession = {
        _id: new ObjectId(),
        _userId: user._id,
        issuedAt: new Date(),
        requester: getRequesterInfo(request),
        consumer: null,
        expiresAt: new Date(Date.now() + 1000 * 60 * 2), // 2 minutes
        token,
        usedAt: null,
    };

    await userSessionsDb.insertOne(sess);

    // if we're in development mode, then log the pin code to the console
    if (dev) {
        console.log(`Pin code for ${user.email}: ${token}`);
    }

    // send the email message to the user
    await sendEmail({
        to: `${user.displayName} <${user.email}>`,
        subject: "Passwordless Login",
        body: {
            greeting: `Hi ${user.displayName}`,
            intro: "You are receiving this email because a login request was made using your email address.",
            outro: "If you did not request a password reset, no further action is required.",

            action: {
                instructions: `
                Your pin code is <strong>${token}</strong>. You can enter it on the login page to continue or 
                click the button below to login instantly on this device. This pin code will expire after 2 minutes
                or after it has been used once.
                `,
                button: {
                    color: "#3f51b5",
                    text: token,
                    link: `${ORIGIN}/login?email=${encodeURIComponent(email)}&pin=${token}`,
                },
            },
        },
    });
}

const VERIFY_SCHEMA = z.object({
    email: z.string().email(),
    pin: z.string().length(6).regex(/^\d+$/),
});

/**
 * Verifies the given pin code and logs the user in if it is valid.
 */
async function verify({
    input,
    cookies,
    request,
}: {
    input: { email: string; pin: string; };
    request: Request;
    cookies: Cookies;
}) {
    const validation = VERIFY_SCHEMA.safeParse(input);
    if (!validation.success) {
        return { error: validation.error.issues[0].message };
    }

    const { email, pin } = validation.data;

    const user = await usersDb.findOne({ email, deletedAt: null });
    if (!user) {
        return { error: "Failed to login with the given credentials.", pin };
    }

    // find the related session
    const sess = await userSessionsDb.findOneAndUpdate({
        _userId: user._id,
        token: pin,
        usedAt: null,
        expiresAt: { $gt: new Date() },
    }, {
        $set: {
            consumer: getRequesterInfo(request),
            usedAt: new Date(),
        },
    });
    if (!sess.value) {
        return { error: "Invalid or expired pin was provided.", pin };
    }

    // create a new session for the user
    await setUserSession(cookies, {
        locale: user.localeCode || LocaleCode.English,
        theme: user.theme,
        userId: user._id,
        version: user.version || LATEST_VERSION,
    });

    throw redirect(302, "/");
}


function generateSecurePin() {
    let pin = "";

    while (pin.length < 6) {
        const byte = crypto.randomInt(0, 10).toString();
        pin += byte;
    }

    return pin;
}

function getRequesterInfo(request: Request) {
    return {
        ipAddress: request.headers.get("x-forwarded-for") || "",
        userAgent: request.headers.get("user-agent") || "",
    };
}