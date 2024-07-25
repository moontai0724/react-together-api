import { Type } from "@sinclair/typebox";
import { nullable } from "helpers/schema";

export const photoSchema = Type.Object({
  id: Type.Integer({
    description: "Auto-incremented serial id for photo in this system",
  }),
  flickrId: Type.Integer({
    description: "Flickr photo ID, reference to flickr_photos.id",
  }),
  categoryId: Type.Integer({
    description: "ID of file category (first-layer folder)",
  }),
  photographerId: Type.Integer({
    description: "ID of file taker (sub-folder name under category folder)",
  }),
  fileName: Type.String({
    description: "File name",
  }),
  createdAt: Type.String({
    description: "Time the photo was uploaded to this system",
  }),
  updatedAt: Type.String({
    description: "Time the photo was last uploaded to this system",
  }),
  deletedAt: nullable(
    Type.String({
      description: "Time the photo was deleted from this system",
    }),
  ),
});
