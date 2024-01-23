import { pagesDb, redirectsDb, revisionsDb } from "$lib/server/dbo";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { ObjectId } from "mongodb";

export const load = (async ({ params, url }) => {

    const path = params.path;
    if (!path) {
        throw error(404, "Page not found");
    }

    // let's check to see if we have a redirect, if we do we'll perform the redirect
    const redirectDoc = await redirectsDb.findOne({ path });
    if (redirectDoc) {
        throw redirect(301, redirectDoc.destination);
    }

    // is the path an ObjectID? if so, it's likely a revision ID so we'll perform a query to find
    // the page content by the revision (along with all revisions + authors that led up to it)
    if (ObjectId.isValid(path)) {
        const revisionId = new ObjectId(path);
        const revCursor = revisionsDb.aggregate<{
            _id: ObjectId;
            _pageId: ObjectId;
            path: string;
            title: string;
            description: string;
            updatedAt: Date;
            tags: string[];
            markdown: string;
            revisions: {
                _id: ObjectId;
                createdAt: Date;
                changeMessage: string;
                author: {
                    _id: ObjectId;
                    displayName: string;
                    avatarUrl: string;
                };
            }[];
        }>([
            {
                $match: {
                    "_id": revisionId,
                },
            }, {
                $lookup: {
                    from: "page_revisions",
                    as: "revisions",
                    let: {
                        pageId: "$_pageId",
                        createdAt: "$createdAt",
                    },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ["$_pageId", "$$pageId"] } },
                        }, {
                            $match: { $expr: { $lt: ["$createdAt", "$$createdAt"] } },
                        },
                        { $lookup: { from: "users", as: "author", localField: "_authorId", foreignField: "_id" } },
                        { $unwind: { path: "$author" } },
                        { $sort: { createdAt: -1 } },
                    ],
                },
            },
            {
                $project: {
                    "_id": 1,
                    "_pageId": 1,
                    "path": 1,
                    "title": 1,
                    "description": 1,
                    "updatedAt": 1,
                    "tags": 1,
                    "markdown": 1,
                    "revisions._id": 1,
                    "revisions.createdAt": 1,
                    "revisions.changeMessage": 1,
                    "revisions.author._id": 1,
                    "revisions.author.displayName": 1,
                    "revisions.author.avatarUrl": 1,
                },
            },
        ]);

        const result = await revCursor.next();
        await revCursor.close();

        if (!result) {
            throw error(404, "Page not found");
        }

        return {
            isRevision: true,
            revisionId: result._id.toHexString(),
            pageId: result._pageId.toHexString(),
            path: result.path,
            fullPath: url.protocol + "//" + url.host + "/" + result.path,
            title: result.title,
            description: result.description,
            date: result.updatedAt.toISOString(),
            tags: result.tags,
            markdown: result.markdown,
            locked: true,
            deletedAt: null,
            revisions: result.revisions.map((rev) => ({
                id: rev._id.toHexString(),
                createdAt: rev.createdAt,
                changeMessage: rev.changeMessage,
                author: {
                    id: rev.author._id.toHexString(),
                    displayName: rev.author.displayName,
                    avatarUrl: rev.author.avatarUrl,
                },
            })),
        };
    } else {
        const pageCursor = pagesDb.aggregate<{
            _id: ObjectId;
            _revisionId: ObjectId;
            path: string;
            title: string;
            description: string;
            lockedAt: Date;
            updatedAt: Date;
            deletedAt: Date;
            tags: string[];
            markdown: string;
            revisions: {
                _id: ObjectId;
                createdAt: Date;
                changeMessage: string;
                author: {
                    _id: ObjectId;
                    displayName: string;
                    avatarUrl: string;
                };
            }[];
        }>([
            {
                $match: {
                    path: path.toLowerCase(),
                    deletedAt: null,
                },
            }, {
                $lookup: {
                    from: "page_revisions",
                    as: "revisions",
                    let: { pageId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_pageId", "$$pageId"] } } },
                        { $lookup: { from: "users", as: "author", localField: "_authorId", foreignField: "_id" } },
                        { $unwind: { path: "$author" } },
                        { $sort: { createdAt: -1 } },
                    ],
                },
            },
            {
                $project: {
                    "_id": 1,
                    "_revisionId": 1,
                    "path": 1,
                    "title": 1,
                    "description": 1,
                    "lockedAt": 1,
                    "updatedAt": 1,
                    "deletedAt": 1,
                    "tags": 1,
                    "markdown": 1,
                    "revisions._id": 1,
                    "revisions.createdAt": 1,
                    "revisions.changeMessage": 1,
                    "revisions.author._id": 1,
                    "revisions.author.displayName": 1,
                    "revisions.author.avatarUrl": 1,
                },
            },
        ]);

        const result = await pageCursor.next();
        await pageCursor.close();

        if (!result) {
            throw error(404, "Page not found");
        }

        return {
            isRevision: false,
            path: result.path,
            revisionId: result._revisionId.toHexString(),
            pageId: result._id.toHexString(),
            fullPath: url.protocol + "//" + url.host + "/" + result.path,
            title: result.title,
            description: result.description,
            date: result.updatedAt.toISOString(),
            tags: result.tags,
            markdown: result.markdown,
            locked: result.lockedAt !== null,
            deletedAt: result.deletedAt?.toISOString() ?? null,
            revisions: result.revisions.map((rev) => ({
                id: rev._id.toHexString(),
                createdAt: rev.createdAt,
                changeMessage: rev.changeMessage,
                author: {
                    id: rev.author._id.toHexString(),
                    displayName: rev.author.displayName,
                    avatarUrl: rev.author.avatarUrl,
                },
            })),
        };
    }
}) satisfies PageServerLoad;