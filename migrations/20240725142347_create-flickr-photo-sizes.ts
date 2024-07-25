import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("flickr_photo_sizes")
    // serial will auto-increment the id
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("flickr_id", "bigint", (col) => col.notNull().unsigned())
    .addForeignKeyConstraint(
      "flickr_photo_sizes_flickr_id_fkey",
      ["flickr_id"],
      "flickr_photos",
      ["id"],
      (col) => col.onUpdate("cascade").onDelete("cascade"),
    )
    .addColumn("label", "varchar(25)", (col) => col.notNull())
    .addColumn("width", "integer", (col) => col.notNull())
    .addColumn("height", "integer", (col) => col.notNull())
    .addColumn("source", "varchar(200)", (col) => col.notNull())
    .addColumn("url", "varchar(200)", (col) => col.notNull())
    .addColumn("media", "varchar(20)", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("flickr_photo_sizes").execute();
}
