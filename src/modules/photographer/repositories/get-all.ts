import { db, type Photographer } from "database";

interface GetAllOptions {
  orderBy?: OrderBy<Photographer>;
}

export async function getAll({ orderBy }: GetAllOptions = {}) {
  let query = db.selectFrom("photographers").selectAll();

  if (orderBy) {
    Object.entries(orderBy).forEach(([key, value]) => {
      query = query.orderBy(key as keyof Photographer, value as "asc" | "desc");
    });
  }

  return query.execute();
}
