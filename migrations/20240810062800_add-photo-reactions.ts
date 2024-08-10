import type { Kysely } from "kysely";

import { withTimestamps } from "./common";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("photo_reactions")
    .addColumn("photo_id", "bigint", (col) => col.unsigned().notNull())
    .addForeignKeyConstraint(
      "photo_reactions_photo_id_fkey",
      ["photo_id"],
      "photos",
      ["id"],
      (col) => col.onUpdate("cascade").onDelete("cascade"),
    )
    .addColumn("user_id", "bigint", (col) => col.unsigned().notNull())
    .addForeignKeyConstraint(
      "photo_reactions_user_id_fkey",
      ["user_id"],
      "users",
      ["id"],
      (col) => col.onUpdate("cascade").onDelete("cascade"),
    )
    .addPrimaryKeyConstraint("photo_reactions_pkey", ["photo_id", "user_id"])
    .addColumn("is_recommended", "boolean", (col) => col.notNull())
    .addColumn("comment", "text")
    .$call(withTimestamps)
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("photo_reactions").execute();
}
