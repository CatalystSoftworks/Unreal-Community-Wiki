import { MongoClient } from "mongodb";
import { env } from "$env/dynamic/private";

const client = new MongoClient(env.DATABASE_URL!);
await client.connect();

process.on("exit", () => client.close());

/** The database connection. */
export const db = client.db();