import { type Static, Type } from "@sinclair/typebox";

export const flickrPhotoSchema = Type.Object({
  id: Type.Integer({
    description: "Flickr photo ID",
  }),
  url: Type.String({
    description: "Flickr photo page",
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
