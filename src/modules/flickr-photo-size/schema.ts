import { type TBigInt, type TInteger, Type } from "@sinclair/typebox";

export const flickrPhotoSizeSchema = Type.Object({
  id: Type.Integer({
    description: "Auto-incremented serial id in this system",
  }) as TInteger | TBigInt,
  flickrId: Type.Integer({
    description: "Flickr photo ID, reference to flickr_photos.id",
  }),
  label: Type.String({
    description: "Description of the size",
    examples: ["Square", "X-Large 6K", "Original"],
  }),
  width: Type.Integer({
    description: "Width of the iamge size",
    examples: [1024, 640, 1280],
  }),
  height: Type.Integer({
    description: "Height of the iamge size",
    examples: [768, 480, 720],
  }),
  source: Type.String({
    description: "The direct image url for the size",
    examples: [
      "https://live.staticflickr.com/65535/52865522979_a22165bf3f_o.jpg",
    ],
  }),
  url: Type.String({
    description: "The url to the image description page",
    examples: [
      "https://www.flickr.com/photos/moontai0724/52865522979/sizes/o/",
    ],
  }),
  media: Type.String({
    description: "The media type of the size",
    examples: ["photo"],
  }),
});
