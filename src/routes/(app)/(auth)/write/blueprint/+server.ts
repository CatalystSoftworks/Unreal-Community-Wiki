import { json } from "@sveltejs/kit";
import * as Sentry from "@sentry/sveltekit";
import type { RequestHandler } from "./$types";
import { z } from "zod";
import { env } from "$env/dynamic/private";
import { UserError } from "$lib/errors";

const SCHEMA = z.object({
    title: z.string().max(255),
    blueprint: z.string().regex(/^Begin Object/),
});

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();

        const validated = SCHEMA.safeParse(data);
        if (!validated.success) {
            throw new UserError("The title or blueprint content is invalid");
        }

        const res = await fetch("https://blueprintue.com/api/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Token": env.BLUEPRINT_UE_API_KEY,
            },
            body: [
                `title=${encodeURIComponent(validated.data.title)}`,
                `blueprint=${encodeURIComponent(validated.data.blueprint)}`,
                `exposure=unlisted`,
                `expiration=never`,
            ].join("&"),
        });

        const { key, error } = await res.json();

        if (!res.ok || error) {
            throw new Error(`Failed to upload blueprint to BlueprintUE due to error (${error ?? "unknown"})`);
        }

        if (!key) {
            throw new Error("Did not receive a key from BlueprintUE");
        }

        return json({ id: key });
    } catch (e) {
        let message = "Failed to upload blueprint due to unknown error";
        if (e instanceof UserError) {
            message = e.message;
        } else {
            Sentry.captureException(e);
        }

        return json({ error: message });
    }
};