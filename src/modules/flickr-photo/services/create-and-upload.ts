import { flickrApis } from "@moontai0724/flickr-sdk";
import { flickrConfigs, timeFormatConfigs } from "configs";
import { type FlickrPhoto } from "database";
import dayjs from "dayjs";
import { flickrPhotoSizeRepository } from "modules/flickr-photo-size";

import {
  create as createRecord,
  getOne,
  getOneByIntegrity,
} from "../repositories";

export interface CreateAndUploadParams {
  integrity: string;
  file: {
    name: string;
    buffer: Buffer;
  };
}

async function upload(photo: File) {
  const uploadedId = await flickrApis.upload.upload({
    credentials: flickrConfigs.credentials,
    photo,
    isPublic: flickrConfigs.defaults.isPublic,
  });

  if (!uploadedId) throw new Error("Failed to upload photo");

  const [photoInfo, photoSizes] = await Promise.all([
    flickrApis.rest.photos.getInfo({
      credentials: flickrConfigs.credentials,
      photoId: uploadedId,
    }),
    flickrApis.rest.photos.getSizes({
      credentials: flickrConfigs.credentials,
      photoId: uploadedId,
    }),
  ]);

  const id = BigInt(photoInfo.id);
  const url = photoInfo.urls.url.shift()!;
  const uploadedAt = dayjs(+photoInfo.dates.posted * 1000).format(
    timeFormatConfigs.datetime,
  );
  const takenAt = photoInfo.dates.taken;

  return {
    id,
    url,
    uploadedAt,
    takenAt,
    isPublic: Boolean(photoInfo.visibility.ispublic),
    sizes: photoSizes.size,
  };
}

export async function create({
  integrity,
  file,
}: CreateAndUploadParams): Promise<FlickrPhoto> {
  const existing = await getOneByIntegrity(integrity);

  if (existing) return existing;

  const flickrPhoto = await upload(new File([file.buffer], file.name));
  const insertId = await createRecord({
    id: flickrPhoto.id,
    integrity,
    url: flickrPhoto.url,
    takenAt: flickrPhoto.takenAt,
    uploadedAt: flickrPhoto.uploadedAt,
    isPublic: flickrPhoto.isPublic,
  });

  if (!insertId) throw new Error("Failed to create a record");

  await flickrPhotoSizeRepository.batchInsert(
    flickrPhoto.sizes.map((size) => ({
      ...size,
      flickrId: insertId,
    })),
  );

  const created = await getOne(insertId);

  if (!created) throw new Error("Failed to get created record");

  return created;
}
