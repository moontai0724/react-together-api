import { flickrApis } from "@moontai0724/flickr-sdk";
import { type FlickrPhoto } from "database";
import dayjs from "dayjs";
import { flickrPhotoSizeRepository } from "modules/flickr-photo-size";
import { timeFormat } from "persistance/config";
import { flickrCredentials } from "persistance/env";

import { create as createRecord, getOne } from "../repositories";
import { getOneByIntegrity } from "../repositories/get-one-by-integrity";

export interface CreateAndUploadParams {
  integrity: string;
  file: {
    name: string;
    buffer: Buffer;
  };
}

async function upload(photo: File) {
  const uploadedId = await flickrApis.upload.upload({
    credentials: flickrCredentials,
    photo,
  });

  if (!uploadedId) throw new Error("Failed to upload photo");

  const [photoInfo, photoSizes] = await Promise.all([
    flickrApis.rest.photos.getInfo({
      credentials: flickrCredentials,
      photoId: uploadedId,
    }),
    flickrApis.rest.photos.getSizes({
      credentials: flickrCredentials,
      photoId: uploadedId,
    }),
  ]);

  const id = BigInt(photoInfo.id);
  const url = photoInfo.urls.url.shift()!;
  const uploadedAt = dayjs(+photoInfo.dates.posted * 1000).format(
    timeFormat.datetime,
  );
  const takenAt = photoInfo.dates.taken;

  return {
    id,
    url,
    uploadedAt,
    takenAt,
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
