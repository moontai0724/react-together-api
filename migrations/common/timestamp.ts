import { type CreateTableBuilder, sql } from "kysely";

export function withTimestamps<TB extends string>(
  qb: CreateTableBuilder<TB>,
): CreateTableBuilder<TB> {
  return qb
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
    );
}
