import { type Category, db } from "database";

interface GetAllOptions {
  orderBy?: OrderBy<Category>;
}

export async function getAll({ orderBy }: GetAllOptions = {}) {
  let query = db.selectFrom("categories").selectAll();

  if (orderBy) {
    Object.entries(orderBy).forEach(([key, value]) => {
      query = query.orderBy(key as keyof Category, value as "asc" | "desc");
    });
  }

  return query.execute();
}
