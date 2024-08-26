import { json } from "@sveltejs/kit";
import * as Sentry from "@sentry/sveltekit";
import type { RequestHandler } from "./$types";
import slugify from "slugify";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { pagesDb, revisionsDb } from "$lib/server/dbo";
import { notifyModsViaDiscord } from "$lib/server/discord";
import { UserError } from "$lib/errors";
import { env } from "$env/dynamic/private";
// import purify from "isomorphic-dompurify";

const SCHEMA = z.object({
	revId: z.string().optional().nullable(),
	title: z.string().max(255),
	description: z.string().max(255),
	tags: z.array(z.string()).max(10),
	markdown: z.string(),
	changeMessage: z.string().max(255),
});

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		const data = await request.json();

		if (!user) {
			return json({ error: "You must be logged in to publish a page or revision" });
		}

		const validated = SCHEMA.safeParse(data);
		if (!validated.success) {
			console.error(validated.error.issues)
			return json({ error: "One or more fields are invalid" });
		}

		const input = validated.data;
		// const markdown = purify.sanitize(input.markdown);

		// create a new page revision
		let rev: DBO.PageRevision = {
			_id: new ObjectId(),
			_previousRevisionId: null,
			_pageId: new ObjectId(),
			_authorId: user._id,
			tags: input.tags,
			title: input.title,
			path: "",
			description: input.description,
			markdown: input.markdown,
			localeCode: user.localeCode,
			changeMessage: input.changeMessage,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedBy: null,
			deletionReason: "",
			deletedAt: null,
		};

		if (input.revId) {
			if (!ObjectId.isValid(input.revId)) {
				throw new UserError("An invalid revision ID was provided");
			}

			const page = await pagesDb.findOne({
				_revisionId: new ObjectId(input.revId),
				deletedAt: null,
			});

			if (!page) {
				throw new UserError("Failed to find page using the given revision ID as the active revision. This might mean you have a potential merge conflict with another user's edits.");
			}

			if (page.lockedAt) {
				throw new UserError("Failed to publish new page revision as the page has been locked.");
			}

			rev = {
				...rev,
				_previousRevisionId: page._revisionId,
				_pageId: page._id,
				path: page.path,
				localeCode: page.localeCode,
			};
		} else {
			// create the path for the page, this is a slugified version of the page title with the last 6 digits
			// of the pageID appended to the end of it. once a page has been published, the page will NOT be changed
			// by further changes to the page title. This is because we want to retain the path for user's saved bookmarks
			// and cached search results. In the future, we may implement a feature that will automatically added redirects
			// in the event a path is changed.
			const pathSuffix = rev._pageId.toHexString().slice(-6);
			rev.path = (slugify(input.title) + "-" + pathSuffix).toLowerCase();
		}

		// store our new revision in the database
		const write = await revisionsDb.insertOne(rev);
		if (!write.acknowledged) {
			throw new Error(`Mongo failed to acknowledge the write for the new revision "${rev._id.toHexString()}".`);
		}

		// perform an upsert for the page record
		const upsert = await pagesDb.updateOne(
			{ _id: rev._pageId },
			{
				$setOnInsert: {
					_id: rev._pageId,
					createdAt: new Date(),
					lockedAt: null,
					deletedBy: null,
					deletionReason: "",
					deletedAt: null,
				},
				$set: {
					_revisionId: rev._id,
					tags: rev.tags,
					path: rev.path,
					title: rev.title,
					description: rev.description,
					markdown: rev.markdown,
					localeCode: rev.localeCode,
					updatedAt: new Date(),
				},
			},
			{
				upsert: true,
			});

		if (!upsert.acknowledged) {
			throw new Error(`Failed to publish page for revision "${rev._id.toHexString()}".`);
		}

		// perform analysis on the new revision and send a notification to the mod discord channel
		// TODO: queue this to a worker
		await analyzeAndNotify(env.ORIGIN, rev, user);

		return json({ path: rev.path });

	} catch (err) {
		let message = "An unknown error occurred while trying to publish the page revision.";
		if (err instanceof UserError) {
			message = err.message;
		} else {
			console.error(err);
			Sentry.captureException(err);
		}

		return json({ error: message });
	}
};

/**
 * Generates the message that will be sent to moderators via Discord. This function also does some analysis on
 * the published revision to make suggestions about moderation action needed.
 */
async function analyzeAndNotify(baseUrl: string, rev: DBO.PageRevision, user: DBO.User) {
	const id = rev._id.toHexString();
	const username = user.displayName;
	const userId = user._id.toHexString();

	let reviewRequested = false;
	let message = `[${username} - ${userId}] just published [Revision ${id}](${baseUrl}/${rev.path}) for the page _"${rev.title}"_.\n`;

	try {

		const [totalContribCount, deletedContribCount] = await Promise.all([
			revisionsDb.countDocuments({ _authorId: user._id }),
			revisionsDb.countDocuments({ _authorId: user._id, deletedAt: { $ne: null } }),
		]);
		const deletedRatio = deletedContribCount / totalContribCount;

		message += `- Change Summary: _"${rev.changeMessage}"_.\n`;

		if (totalContribCount === 1) {
			message += `- This is the user's first contribution to the site.\n`;
			reviewRequested = true;
		} else if (deletedRatio >= 0.25) {
			message += `- This user has had more than 25% of their contributions deleted (${deletedContribCount} / ${totalContribCount} = ${deletedRatio.toFixed(2)}% deletion rate).\n`;
			reviewRequested = true;
		} else {
			message += `- This user has made ${totalContribCount} contributions, of which ${deletedContribCount} (${deletedRatio.toFixed(2)}%) have been deleted.\n`;
		}

		if (!rev._previousRevisionId) {
			message += `- This is a new page and not an edit of an existing one.\n`;
			reviewRequested = true;
		} else {

			const prevRev = await revisionsDb.findOne({ _id: rev._previousRevisionId });
			if (!prevRev) {
				throw new Error(`Failed to find previous revision with ID "${rev._previousRevisionId.toHexString()}".`);
			}

			const charactersAdded = rev.markdown.length - prevRev.markdown.length;

			if (charactersAdded < 0) {
				message += `- More content was removed (${Math.abs(charactersAdded)} characters) than was added.\n`;
				reviewRequested = true;
			} else if (charactersAdded === 0) {
				message += `- No content was changed.\n`;
			} else {
				message += `- A total of ${charactersAdded} characters were added.\n`;
			}

		}
	} catch (err) {
		const msg = err instanceof Error ? err.message : (err as string);
		message += `- A failure occurred while trying to perform further code analysis. Please investigate at a developer level. Error: ${msg}`;
		reviewRequested = true;
	}

	if (reviewRequested) {
		message = "@here Manual review requested based on content and user analysis. " + message;
	}

	await notifyModsViaDiscord(message);
}
