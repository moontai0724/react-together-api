import { getAll } from "../repositories";

export async function list() {
  return getAll({
    orderBy: {
      id: "asc",
    },
  });
}
