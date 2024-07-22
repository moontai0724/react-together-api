import { db } from "database";

export async function getIn(photographerIds: bigint[]) {
  return db
    .selectFrom("photographers")
    .where("id", "in", photographerIds)
    .selectAll()
    .execute();
}
