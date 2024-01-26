import { ObjectId } from "mongodb";
import { revisionsDb, usersDb } from "$lib/server/dbo";
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

    const user = await usersDb.findOne({ _id: id });
    if (!user) {
        return json({ error: "User not found" });
    }

    const revisionCount = await revisionsDb.countDocuments({
        _authorId: id,
        deletedAt: null,
    });

    const info: UserInfoSubset = {
        id: user._id.toHexString(),
        displayName: user.displayName,
        email: user.emailPublic ? user.email : null,
        avatarUrl: user.avatarUrl,
        revisionCount: revisionCount,
        bio: user.bio,
        socials: {
            github: user.socials.github,
            twitter: user.socials.twitter,
            website: user.socials.website,
        },
    };

    return json(info);
};
