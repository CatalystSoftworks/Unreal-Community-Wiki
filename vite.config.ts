import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import svg from "@poppanator/sveltekit-svg";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    plugins: [
        sentrySvelteKit({
            sourceMapsUploadOptions: {
                org: "catalyst-softworks",
                project: "unreal-community-wiki",
                authToken: process.env.SENTRY_AUTH_TOKEN,
            },
        }),
        sveltekit(),
        svg({
            type: "src",
            svgoOptions: {
                plugins: [
                    {
                        name: "preset-default",
                        params: {
                            overrides: {
                                removeViewBox: false,
                            },
                        },
                    },
                    {
                        name: "convertColors",
                        params: {
                            currentColor: true,
                        },
                    },
                ],
            },
        }),
    ],
    test: {
        include: ["src/**/*.{test,spec}.{js,ts}"],
    },
});