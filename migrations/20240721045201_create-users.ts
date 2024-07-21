import type { Kysely } from "kysely";

import { withTimestamps } from "./common";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("users")
    // serial will auto-increment the id
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("email", "varchar(256)", (col) => col.unique().notNull())
    .$call(withTimestamps)
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("users").execute();
}
