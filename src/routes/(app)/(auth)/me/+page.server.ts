/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Actions, PageServerLoad } from "./$types";
import * as Sentry from "@sentry/sveltekit";
import { clearUserSession } from "$lib/server/session";
import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { usersDb } from "$lib/server/dbo";
import { uploadFile } from "$lib/server/upload";
import { UserError } from "$lib/errors";

export const load = (async ({ locals }) => {
    const user = locals.user!;

    return {
        profile: {
            email: user.email,
            emailPublic: user.emailPublic,
            avatarUrl: user.avatarUrl,
            displayName: user.displayName,
            bio: user.bio ?? "",
            website: user.socials.website ?? "",
            twitter: user.socials.twitter ?? "",
            github: user.socials.github ?? "",
            discord: user.socials.discord ?? "",
        },
    };
}) satisfies PageServerLoad;


const PROFILE_SCHEMA = z.object({
    // email: z.string().email(),
    emailPublic: z.boolean(),
    displayName: z.string().min(1),
    bio: z.string().max(256).optional(),
    website: z.string().min(1).url().optional().or(z.literal("")),
    twitter: z.string().optional(),
    github: z.string().optional(),
    // discord: z.string().optional(),
});


export const actions: Actions = {
    async updateProfile({ request, locals }) {
        const user = locals.user!;
        const data = await request.formData();
        const avatar = data.get("avatar");

        let profile = {
            email: user.email,
            avatarUrl: user.avatarUrl,
            emailPublic: data.get("emailPublic") === "true",
            displayName: data.get("displayName") ?? "",
            bio: data.get("bio") ?? "",
            website: data.get("website") ?? "",
            twitter: data.get("twitter") ?? "",
            github: data.get("github") ?? "",
            // discord: data.get("discord") ?? "",
        };

        try {

            if (avatar && avatar instanceof File && avatar.size > 0) {
                if (!avatar.type.startsWith("image/")) {
                    throw new UserError("Invalid image file type, only images are allowed");
                }

                if (avatar.size > 32 * 1024 * 1024) {
                    throw new UserError("Image file too large, avatar images must be less than 32mb");
                }

                profile.avatarUrl = await uploadFile(avatar);
            }

            const validation = PROFILE_SCHEMA.safeParse(profile);

            if (!validation.success) {
                const error = "Failed to update profile due to invalid input: \n"
                    + validation.error.errors.map(e => e.message).join("\n");

                throw new UserError(error);
            }

            profile = {
                ...profile,
                ...validation.data,
            };

            await usersDb.updateOne({ _id: user._id }, {
                $set: {
                    // email: profile.email,
                    avatarUrl: profile.avatarUrl,
                    emailPublic: profile.emailPublic,
                    displayName: profile.displayName as string,
                    bio: profile.bio as string,
                    socials: {
                        website: (profile.website as string) ?? null,
                        twitter: (profile.twitter as string) ?? null,
                        github: (profile.github as string) ?? null,
                    },
                },
            });

            return {
                profile,
                success: "Your profile has been updated.",
            };
        } catch (e) {
            let statuscode = 500;
            let message = "Unable to update profile due to an internal server error.";
            if (e instanceof UserError) {
                statuscode = 400;
                message = e.message;
            } else {
                Sentry.captureException(e);
            }

            return fail(statuscode, {
                error: message,
                profile,
            });
        }
    },
    async logout({ cookies }) {
        await clearUserSession(cookies);
        throw redirect(302, "/");
    },
};