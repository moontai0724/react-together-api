import type { Category } from "database";

import { loadCategories } from "./load-categories";
import { loadPhotographers } from "./load-photographers";

async function loadCategoryPhotographers(category: Category) {
  const photographers = await loadPhotographers(category);

  return {
    ...category,
    photographers,
  };
}

async function loadAllPhotographers(categories: Category[]) {
  return Promise.all(categories.map(loadCategoryPhotographers));
}

(async () => {
  const categories = await loadCategories().then(loadAllPhotographers);

  console.log(JSON.stringify(categories, null, 2));
})();
