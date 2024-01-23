import { ObjectId } from "mongodb";
import { usersDb } from "$lib/server/dbo";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

export interface UserInfoSubset {
    id: string;
    displayName: string;
    email: string | null;
    avatarUrl: string;
    revisionCount: number;
    bio: string;
    socials: {
        github?: string | null;
        twitter?: string | null;
        website?: string | null;
    };
}

export type UserJsonResponse = UserInfoSubset | { error: string };

export const GET: RequestHandler = async ({ params }) => {
    const id = new ObjectId(params.id);

    const userCursor = usersDb.aggregate([
        { $match: { _id: id } },
        {
            $lookup: {
                from: "page_revisions",
                localField: "_id",
                foreignField: "_authorId",
                as: "revisions",
            },
        },
        {
            $addFields: {
                "revisionCount": { $size: "$revisions" },
            },
        },
        {
            $project: {
                _id: 1,
                displayName: 1,
                email: 1,
                emailPublic: 1,
                bio: 1,
                avatarUrl: 1,
                revisionCount: 1,
                socials: 1,
            },
        },
    ]);

    const user = await userCursor.next();
    if (!user) {
        return json({ error: "User not found" }, { status: 404 });
    }

    const info: UserInfoSubset = {
        id: user._id.toHexString(),
        displayName: user.displayName,
        email: user.emailPublic ? user.email : null,
        avatarUrl: user.avatarUrl,
        revisionCount: user.revisionCount,
        bio: user.bio,
        socials: {
            github: user.socials.github,
            twitter: user.socials.twitter,
            website: user.socials.website,
        },
    };

    return json(info);
};
