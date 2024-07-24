type OrderBy<T> = {
  [key in keyof T]?: "asc" | "desc";
};
