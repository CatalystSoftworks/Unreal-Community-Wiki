/* eslint-disable prefer-const */
import { z } from "zod";
import type { Actions } from "./$types";
import { usersDb } from "$lib/server/dbo";
import { ObjectId } from "mongodb";
import { _requestCode } from "../login/+page.server";
import { VERSIONS } from "$lib/versions";
import { redirect } from "@sveltejs/kit";

const REGISTER_SCHEMA = z.object({
    displayName: z.string().min(1),
    email: z.string().email(),
});

export const actions: Actions = {
    async default({ request, locals }) {
        const sess = locals.session;
        const data = await request.formData();

        const input = {
            displayName: data.get("displayName") ?? "",
            email: data.get("email") ?? "",
        };

        const validation = REGISTER_SCHEMA.safeParse(input);
        if (!validation.success) {
            return { error: validation.error.issues[0].message, ...input };
        }

        let { displayName, email } = validation.data;

        email = email.toLowerCase().trim();

        // make sure the email is not already taken
        const existingUser = await usersDb.findOne({ email });
        if (existingUser) {
            return { error: `The email address "${email}" is not available.`, displayName, email };
        }

        // create user record
        const user: DBO.User = {
            _id: new ObjectId(),
            displayName,
            email,
            emailPublic: false,
            avatarUrl: "",
            localeCode: sess?.locale ?? "en",
            theme: sess?.theme ?? "auto",
            version: null,
            bio: "",
            socials: {
                website: null,
                twitter: null,
                github: null,
                discord: null,
            },
            deletedAt: null,
            deletedBy: null,
            deletionReason: "",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await usersDb.insertOne(user);

        await _requestCode(email, request);

        throw redirect(302, "/login?/verify&email=" + encodeURIComponent(email));
    },
};