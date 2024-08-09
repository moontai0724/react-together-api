import {
  type Static,
  type TBigInt,
  type TInteger,
  Type,
} from "@sinclair/typebox";

export const flickrPhotoSchema = Type.Object({
  id: Type.Integer({
    description: "Flickr photo ID",
  }) as TInteger | TBigInt,
  url: Type.String({
    description: "Flickr photo page",
  }),
  integrity: Type.String({
    description: "File integrity",
    minLength: 64,
    maxLength: 64,
  }),
  takenAt: Type.String({
    description: "Photo taken time from Flickr",
  }),
  uploadedAt: Type.String({
    description: "Photo uploaded time from Flickr",
  }),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export type FlickrPhotoSchema = Static<typeof flickrPhotoSchema>;
