import {
  type Category,
  db,
  type FlickrPhoto,
  type FlickrPhotoSize,
  type Photo,
  type Photographer,
} from "database";

export interface GetAllOptions {
  orderBy?: OrderBy<Pick<FlickrPhoto, "takenAt" | "updatedAt">>[];
  photographerIds?: Photo["photographerId"][];
  categoryIds?: Photo["categoryId"][];
  page?: {
    limit: number;
    offset: number;
  };
}

export interface GetAllResult {
  id: bigint;
  fileName: string;
  category: Pick<Category, "id" | "label">;
  photographer: Pick<Photographer, "id" | "name">;
  flickrPhoto: Pick<FlickrPhoto, "id" | "url" | "takenAt">;
  flickrPhotoSizes: Pick<
    FlickrPhotoSize,
    "label" | "width" | "height" | "source" | "url"
  >[];
}

export async function getAll({
  orderBy,
  photographerIds,
  categoryIds,
  page,
}: GetAllOptions = {}): Promise<GetAllResult[]> {
  let base = db
    .selectFrom("photos")
    .leftJoin("categories", "categories.id", "photos.categoryId")
    .leftJoin("photographers", "photographers.id", "photos.photographerId")
    .leftJoin("flickrPhotos", "flickrPhotos.id", "photos.flickrId")
    .select([
      "photos.id",
      "photos.fileName",
      "categories.id as categories-id",
      "categories.label as categories-label",
      "photographers.id as photographers-id",
      "photographers.name as photographers-name",
      "flickrPhotos.id as flickrPhotos-id",
      "flickrPhotos.url as flickrPhotos-url",
      "flickrPhotos.takenAt as flickrPhotos-takenAt",
    ]);

  if (photographerIds?.length)
    base = base.where("photographers.id", "in", photographerIds);

  if (categoryIds?.length)
    base = base.where("categories.id", "in", categoryIds);

  if (orderBy?.length) {
    orderBy.forEach(({ takenAt, updatedAt }) => {
      if (takenAt) base = base.orderBy("flickrPhotos.takenAt", takenAt);
      if (updatedAt) base = base.orderBy("photos.updatedAt", updatedAt);
    });
  }

  if (page) base = base.limit(page.limit).offset(page.offset);

  const final = db
    .selectFrom(base.as("photos"))
    .leftJoin(
      "flickrPhotoSizes",
      "flickrPhotoSizes.flickrId",
      "photos.flickrPhotos-id",
    )
    .selectAll("photos")
    .select([
      "flickrPhotoSizes.id as flickrPhotoSizes-id",
      "flickrPhotoSizes.label as flickrPhotoSizes-label",
      "flickrPhotoSizes.width as flickrPhotoSizes-width",
      "flickrPhotoSizes.height as flickrPhotoSizes-height",
      "flickrPhotoSizes.source as flickrPhotoSizes-source",
      "flickrPhotoSizes.url as flickrPhotoSizes-url",
    ]);

  const photos = await final.execute();

  return Array.from(
    photos
      .reduce((acc, photo) => {
        const { id } = photo;

        if (!acc.has(id)) {
          acc.set(id, {
            id,
            fileName: photo.fileName,
            category: {
              id: photo["categories-id"]!,
              label: photo["categories-label"]!,
            },
            photographer: {
              id: photo["photographers-id"]!,
              name: photo["photographers-name"]!,
            },
            flickrPhoto: {
              id: photo["flickrPhotos-id"]!,
              url: photo["flickrPhotos-url"]!,
              takenAt: photo["flickrPhotos-takenAt"]!,
            },
            flickrPhotoSizes: [],
          });
        }

        const existing = acc.get(id)!;

        existing.flickrPhotoSizes.push({
          label: photo["flickrPhotoSizes-label"]!,
          width: photo["flickrPhotoSizes-width"]!,
          height: photo["flickrPhotoSizes-height"]!,
          source: photo["flickrPhotoSizes-source"]!,
          url: photo["flickrPhotoSizes-url"]!,
        });

        return acc;
      }, new Map<bigint, GetAllResult>())
      .values(),
  );
}
