import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("categories")
    .addColumn("flickr_photoset_id", "bigint", (col) => col.unique().notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("categories")
    .dropColumn("flickr_photoset_id")
    .execute();
}
