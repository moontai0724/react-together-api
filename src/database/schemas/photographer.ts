import type { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface PhotographerTable {
  /**
   * Auto-incremented serial id for photographer in this system
   */
  id: Generated<bigint>;
  /**
   * Photographer name
   */
  name: string;
}

export type Photographer = Selectable<PhotographerTable>;
export type NewPhotographer = Insertable<PhotographerTable>;
export type UpdatePhotographer = Updateable<PhotographerTable>;
