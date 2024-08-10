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
  reactions: {
    like: number;
    dislike: number;
    comments: string[];
  };
  reaction: null | {
    recommend: boolean;
    comment: string;
  };
}

function allPhotos({
  orderBy,
  photographerIds,
  categoryIds,
  page,
}: GetAllOptions = {}) {
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

  return base;
}

type IPhotosQuery = ReturnType<typeof allPhotos>;

async function getSizes(base: IPhotosQuery) {
  const sizes = await db
    .selectFrom(base.as("photos"))
    .leftJoin(
      "flickrPhotoSizes",
      "flickrPhotoSizes.flickrId",
      "photos.flickrPhotos-id",
    )
    .select([
      "photos.id as photoId",
      "flickrPhotoSizes.label as label",
      "flickrPhotoSizes.width as width",
      "flickrPhotoSizes.height as height",
      "flickrPhotoSizes.source as source",
      "flickrPhotoSizes.url as url",
    ])
    .execute();

  return sizes.reduce((acc, size) => {
    const { photoId, ...sizeInfo } = size;

    if (!acc.has(photoId)) acc.set(photoId, []);

    const existing = acc.get(photoId)!;

    existing.push(sizeInfo as GetAllResult["flickrPhotoSizes"][number]);

    return acc;
  }, new Map<bigint, GetAllResult["flickrPhotoSizes"]>());
}

async function getReactions(base: IPhotosQuery) {
  const reactions = await db
    .selectFrom(base.as("photos"))
    .leftJoin("photoReactions", "photoReactions.photoId", "photos.id")
    .select([
      "photos.id as photoId",
      "photoReactions.userId as userId",
      "photoReactions.isRecommended as isRecommended",
      "photoReactions.comment as comment",
    ])
    .execute();

  return reactions.reduce((acc, reaction) => {
    const { photoId, isRecommended, comment } = reaction;

    if (!acc.has(photoId))
      acc.set(photoId, {
        reactions: {
          like: 0,
          dislike: 0,
          comments: [],
        },
        // TODO: add own reaction detail if user is logged in
        reaction: null,
      });

    const existing = acc.get(photoId)!;

    existing.reactions[isRecommended ? "like" : "dislike"]++;

    if (comment) existing.reactions.comments.push(comment);

    return acc;
  }, new Map<bigint, Pick<GetAllResult, "reactions" | "reaction">>());
}

export async function getAll({
  orderBy,
  photographerIds,
  categoryIds,
  page,
}: GetAllOptions = {}): Promise<GetAllResult[]> {
  const base = allPhotos({ orderBy, photographerIds, categoryIds, page });
  const photos = await base.selectAll("photos").execute();

  const sizes = await getSizes(base);
  const reactions = await getReactions(base);

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
            ...reactions.get(id)!,
          });
        }

        const existing = acc.get(id)!;

        existing.flickrPhotoSizes.push(...sizes.get(id)!);

        return acc;
      }, new Map<bigint, GetAllResult>())
      .values(),
  );
}
