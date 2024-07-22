import type { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface CategoryTable {
  /**
   * Auto-incremented serial id for Category in this system
   */
  id: Generated<bigint>;
  /**
   * Category label
   */
  label: string;
}

export type Category = Selectable<CategoryTable>;
export type NewCategory = Insertable<CategoryTable>;
export type UpdateCategory = Updateable<CategoryTable>;
