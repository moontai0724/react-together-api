import type { Kysely } from "kysely";

import { withTimestamps } from "./common";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("photos")
    // serial will auto-increment the id
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("flickr_id", "bigint", (col) =>
      col.notNull().unsigned().unique(),
    )
    .addForeignKeyConstraint(
      "photos_flickr_id_fkey",
      ["flickr_id"],
      "flickr_photos",
      ["id"],
      (col) => col.onUpdate("cascade").onDelete("cascade"),
    )
    .addColumn("category_id", "bigint", (col) => col.unsigned())
    .addForeignKeyConstraint(
      "photos_category_id_fkey",
      ["category_id"],
      "categories",
      ["id"],
      (col) => col.onUpdate("cascade").onDelete("set null"),
    )
    .addColumn("photographer_id", "bigint", (col) => col.unsigned())
    .addForeignKeyConstraint(
      "photos_photographer_id_fkey",
      ["photographer_id"],
      "photographers",
      ["id"],
      (col) => col.onUpdate("cascade").onDelete("cascade"),
    )
    .addColumn("file_name", "varchar(300)", (col) => col.notNull())
    .addUniqueConstraint("photos_file_path_unique", [
      "category_id",
      "photographer_id",
      "file_name",
    ])
    .addColumn("integrity", "char(64)", (col) => col.notNull().unique())
    .$call(withTimestamps)
    .addColumn("deleted_at", "timestamp", (col) => col.defaultTo(null))
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("photos").execute();
}
