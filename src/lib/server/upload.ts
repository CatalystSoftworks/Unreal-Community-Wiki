import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { env } from "$env/dynamic/private";
import { ObjectId } from "mongodb";

/**
 * Helper function for uploading files to S3.
 */
export async function uploadFile(file: File) {
    const key = (new ObjectId()).toHexString();

    // create a buffer from the file
    const buffer = new Uint8Array(await file.arrayBuffer());

    const upload = new Upload({
        client: new S3Client({
            region: env.S3_REGION,
            credentials: {
                accessKeyId: env.S3_ACCESS_KEY_ID,
                secretAccessKey: env.S3_SECRET_ACCESS_KEY,
            },
        }),
        params: {
            ACL: "public-read",
            Bucket: env.S3_BUCKET,
            Key: key,
            Body: buffer,
        },
    });

    const res = await upload.done();

    if (!res.Location) {
        throw new Error("Failed to upload file to S3");
    }

    return res.Location;
}
