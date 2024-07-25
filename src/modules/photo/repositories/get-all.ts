import { db, type FlickrPhoto, type Photo } from "database";

export interface GetAllOptions {
  orderBy?: OrderBy<Pick<FlickrPhoto, "takenAt" | "updatedAt">>[];
  photographerIds?: Photo["photographerId"][];
  categoryIds?: Photo["categoryId"][];
  page?: {
    limit: number;
    offset: number;
  };
}

export async function getAll({
  orderBy,
  photographerIds,
  categoryIds,
  page,
}: GetAllOptions = {}) {
  let query = db
    .selectFrom("photos")
    .selectAll()
    .leftJoin("categories", "categories.id", "photos.categoryId")
    .leftJoin("photographers", "photographers.id", "photos.photographerId")
    .leftJoin("flickrPhotos", "flickrPhotos.id", "photos.flickrId");

  if (photographerIds?.length)
    query = query.where("photographers.id", "in", photographerIds);

  if (categoryIds?.length)
    query = query.where("categories.id", "in", categoryIds);

  if (orderBy?.length) {
    orderBy.forEach(({ takenAt, updatedAt }) => {
      if (takenAt) query = query.orderBy("flickrPhotos.takenAt", takenAt);
      if (updatedAt) query = query.orderBy("photos.updatedAt", updatedAt);
    });
  }

  if (page) query = query.limit(page.limit).offset(page.offset);

  return query.execute();
}
