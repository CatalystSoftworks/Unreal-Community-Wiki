import type { ObjectId } from "mongodb";
import { db } from "./db";
import { LOCALES } from "$lib/locales";

type LocaleCode = typeof LOCALES[number];

/** Defines a record that can be deleted but will be retained in some form in the database. */
interface SoftDelete {
    /** The reason for deletion, if this record was deleted. */
    deletionReason: string;
    /** The user that deleted this record, if it was deleted. If still null, deletion was performed by non-user (system). */
    deletedBy: null | ObjectId;
    /** The date/time that the record was deleted, if it was deleted. */
    deletedAt: null | Date;
}

interface BaseDoc {
    /** The unique ID of the record. */
    _id: ObjectId;
    /** The UUID for the record if it was imported from the previous version of the community wiki. */
    legacyId?: string;
    /** The date/time that the record was created. */
    createdAt: Date;
    /** The date/time that the record was last updated. */
    updatedAt: Date;
}

declare global {
    namespace DBO {

        /**
         * Represents some action taken by an authenticated user. This data is captured for security and
         * debugging purposes.
         */
        type Activity<T extends object = any> = {
            /** The unique ID of the record. */
            _id: ObjectId;
            /** The authenticated user that performed the action. */
            _userId: null | ObjectId;
            /** The IP address of the requester. */
            ipAddress: string;
            /** Identifier used to track the type of action taken. */
            action: string;
            /** Relevant data tracked for the request. */
            data: T;
            /** When the activity occurred / was captured. */
            createdAt: Date;
        };

        /** Defines a human user. */
        interface User extends BaseDoc, SoftDelete {
            /** The name to use for this user when displaying their information publicly. */
            displayName: string;
            /** The unique email address used by this user for logging in and receiving transactional emails. */
            email: string;
            /** Determines if the users email should be listed publicly. */
            emailPublic: boolean;
            /** URL to the user's current avatar, if any. */
            avatarUrl: string;
            /** The user's biography to be displayed on their profile page. */
            bio: string;
            /** The user's social network links that appear in their biography. */
            socials: { [key: string]: null | string };
            /** The user's localization preference. */
            localeCode: LocaleCode;
            /** The desired reading mode for the user. */
            theme: "light" | "dark" | "auto";
            /** The desired version that the user wishes to see content filtered for. */
            version: null | number;
        }

        /**
         * Represents an authenticated session for a user.
         */
        interface UserSession {
            /** The unique ID of the session. */
            _id: ObjectId;
            /** The user that this session belongs to. */
            _userId: ObjectId;
            /** Generated token for the session. */
            token: string;
            /** Information about the machine that requested the session. */
            requester: {
                /** The IP address that the session was created from. */
                ipAddress: string;
                /** The user agent that the session was created from. */
                userAgent: string;
            };
            /** Information about the machine that used the session (if any). */
            consumer: null | {
                /** The IP address that the session was used from. */
                ipAddress: string;
                /** The user agent that the session was used from. */
                userAgent: string;
            };
            /** The date/time the session (token) was issued. */
            issuedAt: Date;
            /** The date/time the token expires. */
            expiresAt: Date;
            /** The date/time the token was used. */
            usedAt: null | Date;
        }

        /**
         * Defines an uploaded file. Anytime a file is uploaded through the site, one of these
         * records is created so we can track and reference them safely.
         */
        interface Upload extends BaseDoc {
            /** The user that uploaded this file (if any). */
            _uploaderId: null | ObjectId;
            /** The assigned name / title of the uploaded file. Will likely just be the original filename. */
            name: string;
            /** The stored path of the file on the local or external file system (S3). */
            storedPath: string;
            /** The broad type of the file. */
            type: "image";
            /** The MIME type for the file, based on the uploaded file's extension. */
            mimeType: string;
            /** The size of the file in bytes. */
            filesize: number;
        }

        /**
         * Defines a redirect for the site. Redirects act like permanent redirects that can be configured
         * by users or entities with sufficient permissions to do so.
         */
        interface Redirect extends BaseDoc {
            /** The path that the redirect sits at on the site. */
            path: string;
            /** The URI/URI that we wish to redirect the user to. */
            destination: string;
        }

        /**
         * Defines a page that can be edited by users on the site. All pages have related revisions
         * which can be used to track the edits across the lifespan of the page.
         */
        interface Page extends BaseDoc, SoftDelete {
            /** Determines if this page originated from the original, official Unreal wiki. */
            legacy?: boolean;
            /** The ID of the accepted page revision that was used to populate this page record. */
            _revisionId: ObjectId;
            /** The path that the page sites at on the site. */
            path: string;
            /** Tags used to categorize this page. */
            tags: string[];
            /** The title of the page. */
            title: string;
            /** A short, summarized description of the page. Used for meta data, OpenGraph, and Twitter cards. */
            description: string;
            /** The markdown content for the page, if markdown was used. */
            markdown: string;
            /** The locale that the page was used for. Useful for filtering content based on localization preferences. */
            localeCode: LocaleCode;
            /** The date/time that the record was locked, if locked. Prevents editing when not null. */
            lockedAt: null | Date;
            /** Current number of likes for the page. */
            likes?: number;
        }

        /**
         * Defines a content revision for a page. Revisions support almost all of the fields that a Page
         * does, but extends it with information about how the revision came to be, the type of revision
         * being created, and also provides support for moderation. This is because first-time content
         * creators need approval on their work before it is accepted on the site.
         */
        interface PageRevision extends Omit<Page, "_revisionId" | "lockedAt"> {
            /** The ID of the user that created this revision. */
            _authorId: ObjectId;
            /**
             * The ID of the related page for this revision. If this is the first revision for a new page,
             * this ID is what will be used when creating the page record for the first time.
             */
            _pageId: ObjectId;
            /** The ID of the revision that this revision started from, if any. */
            _previousRevisionId: null | ObjectId;
            /** The change message created when the revision was submitted or published. */
            changeMessage: string;
            /** The date/time that this revision was published, if it was published. */
            // publishedAt: null | Date;
        }

        /** Contains the information about a report that has been filed in relation to another entity. */
        interface Report extends BaseDoc {
            /** The type of entity that is being reported. */
            _subjectType: "revision" | "user";
            /** The ID of the entity that is being reported. */
            _subjectId: ObjectId;
            /** The user that created the report. */
            _reporterId: ObjectId;
            /** The (canned) reason for the report. */
            reason: string;
            /** The details of the report. */
            details: string;
            /** Details about the resolution that led to this report being closed. */
            resolution: string;
            /** The user that closed this report. If null and closed, then a non-user (system) closed this report. */
            _moderatorId: null | ObjectId;
            /** The date/time that this record was closed. */
            closedAt: null | Date;
        }

        /** Tracks a notification that was sent to a user. */
        interface Notification<T extends object = any> extends BaseDoc {
            /** The user that this notification belongs to. */
            _userId: ObjectId;
            /** Identifier used to track the type of action taken. */
            type: string;
            /** Arbitrary payload data that can be stored with this notification. */
            data: T;
            /** The contents of the notification. */
            message: string;
            /** Whether or not an email was sent alongside this notification. */
            emailSent: boolean;
            /** The date/time that this record was seen, if it was seen by the user. */
            seenAt: null | Date;
        }

        /** Represents a user's "like" of a page. */
        interface Like extends BaseDoc {
            /** The user that liked the page. */
            _userId: ObjectId;
            /** The page that was liked. */
            _pageId: ObjectId;
            /** Revision of the page that was liked. */
            _revisionId: ObjectId;
        }
    }
}


export const activityDb = db.collection<DBO.Activity>("activity");
export const usersDb = db.collection<DBO.User>("users");
export const userSessionsDb = db.collection<DBO.UserSession>("user_sessions");
export const pagesDb = db.collection<DBO.Page>("pages");
export const revisionsDb = db.collection<DBO.PageRevision>("page_revisions");
export const redirectsDb = db.collection<DBO.Redirect>("redirects");
export const reportsDb = db.collection<DBO.Report>("reports");
export const notificationsDb = db.collection<DBO.Notification>("notifications");
export const uploadsDb = db.collection<DBO.Upload>("uploads");
export const likesDb = db.collection<DBO.Like>("likes");