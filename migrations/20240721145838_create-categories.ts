import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("categories")
    // serial will auto-increment the id
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("label", "varchar(300)", (col) => col.notNull().unique())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("categories").execute();
}
