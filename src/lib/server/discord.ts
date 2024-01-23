import { env } from "$env/dynamic/private";
import Sentry from "@sentry/sveltekit";

/**
 * Uses Discord's webhook API to send a message to the mod team via the configured channel.
 */
export async function notifyModsViaDiscord(content: string) {
    if (env.DISCORD_MOD_WEBHOOK_URL) {
        try {
            const res = await fetch(env.DISCORD_MOD_WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                }),
            });

            if (!res.ok) {
                throw new Error(`Received ${res.status} ${res.statusText} from Discord.`);
            }

            return;
        } catch (err) {
            console.error("Failed to notify mods via Discord, received error:", err);

            Sentry.captureException(err, {
                extra: {
                    webhookUrl: env.DISCORD_MOD_WEBHOOK_URL,
                    content,
                },
            });
        }
    }

    console.log(`Attempted to send message to mods via Discord:\n${content}`);
}