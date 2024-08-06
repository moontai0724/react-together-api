import { type Category, db, type Photographer } from "database";

import { cleanup } from "./cleanup";
import { loadCategories } from "./load-categories";
import { loadPhotographers } from "./load-photographers";
import { loadPhotos } from "./load-photos";
import { queuedPhotos } from "./photo-queue";

interface CategoryWithPhotographers extends Category {
  photographers: Photographer[];
}

async function loadCategoryPhotographers(category: Category) {
  const photographers = await loadPhotographers(category);

  return {
    ...category,
    photographers,
  };
}

async function loadAllPhotographers(categories: Category[]) {
  const newCategories: CategoryWithPhotographers[] = [];

  for (let index = 0; index < categories.length; index++) {
    const category = await loadCategoryPhotographers(categories[index]);

    console.log(`Category loaded: `, category);

    newCategories.push(category);
  }

  return newCategories;
}

(async () => {
  const categories = await loadCategories().then(loadAllPhotographers);

  const allPhotosImportResults = await Promise.all(
    categories.map(async (category) => {
      const { photographers, ...categoryOnly } = category;

      return Promise.all(
        photographers.map(async (photographer) =>
          loadPhotos(categoryOnly, photographer),
        ),
      ).then((results) => results.flat());
    }),
  ).then((results) => results.flat());

  if (queuedPhotos.length > 0) {
    console.error("Queued photos still exist", queuedPhotos);
  }

  console.log(`Proceed ${allPhotosImportResults.length} photos`);

  await cleanup();

  db.destroy();
})();
