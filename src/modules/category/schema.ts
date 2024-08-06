import { Type } from "@sinclair/typebox";

export const categorySchema = Type.Object({
  id: Type.Integer({
    description: "Auto-incremented serial id for category in this system",
  }),
  label: Type.String({
    description: "Category label",
  }),
  flickrPhotosetId: Type.Integer({
    description: "Flickr photoset id",
  }),
});
