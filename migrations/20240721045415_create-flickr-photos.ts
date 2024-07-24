import type { Kysely } from "kysely";

import { withTimestamps } from "./common";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("flickr_photos")
    // Flickr photo ID
    .addColumn("id", "bigint", (col) => col.primaryKey().unsigned())
    // local calculated file integrity
    .addColumn("integrity", "char(64)", (col) => col.notNull().unique())
    // Flickr photo page
    .addColumn("url", "varchar(100)", (col) => col.notNull())
    // Photo taken time from Flickr
    .addColumn("taken_at", "datetime", (col) => col.notNull())
    // Photo uploaded time from Flickr
    .addColumn("uploaded_at", "datetime", (col) => col.notNull())
    .$call(withTimestamps)
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("flickr_photos").execute();
}
