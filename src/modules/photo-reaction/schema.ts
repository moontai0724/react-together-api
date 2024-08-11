import { type TBigInt, type TInteger, Type } from "@sinclair/typebox";

export const photoReactionSchema = Type.Object({
  photoId: Type.Integer({
    description: "Photo ID, reference to photos.id",
  }) as TInteger | TBigInt,
  userId: Type.Integer({
    description: "User ID, reference to users.id",
  }) as TInteger | TBigInt,
  isRecommended: Type.Boolean({
    description: "Whether the user recommends this photo",
  }),
  comment: Type.Union([
    Type.Null(),
    Type.String({
      description: "Comments for the photo of this user",
    }),
  ]),
});
