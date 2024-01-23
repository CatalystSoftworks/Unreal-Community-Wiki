import { json } from "@sveltejs/kit";
import * as Sentry from "@sentry/sveltekit";
import type { RequestHandler } from "./$types";
import { UserError } from "$lib/errors";
import { uploadFile } from "$lib/server/upload";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.formData();

        const image = data.get("image");

        // ensure the file is an image
        if (!(image instanceof File)) {
            throw new UserError("Missing image file in request");
        }

        // check that the file is an image
        if (!image.type.startsWith("image/")) {
            throw new UserError("Invalid image file type");
        }

        // check that the image file is not too large (less than 100mb)
        if (image.size > 100 * 1024 * 1024) {
            throw new UserError("Image file too large, images must be less than 100mb");
        }

        // upload the image to the image server
        const url = await uploadFile(image);

        return json({ url });

    } catch (e) {
        let message = "Failed to upload image due to server error";
        if (e instanceof UserError) {
            message = e.message;
        } else {
            Sentry.captureException(e);
        }

        return json({ error: message });
    }
};