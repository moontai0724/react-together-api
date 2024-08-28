import { flickrApis } from "@moontai0724/flickr-sdk";
import { flickrCredentialConfigs } from "configs";
import { timeFormatConfigs } from "configs/config";
import { type FlickrPhoto } from "database";
import dayjs from "dayjs";
import { flickrPhotoSizeRepository } from "modules/flickr-photo-size";

import { getOne, update as updateRecord } from "../repositories";
import { getOneByIntegrity } from "../repositories/get-one-by-integrity";

export interface UpdateAndUploadParams {
  flickrId: FlickrPhoto["id"];
  integrity: string;
  file: {
    name: string;
    buffer: Buffer;
  };
}

async function replace(flickrId: FlickrPhoto["id"], photo: File) {
  const { photoId: replacedId } = await flickrApis.upload.replace({
    credentials: flickrCredentialConfigs,
    photoId: flickrId.toString(),
    photo,
  });

  if (!replacedId) throw new Error("Failed to replace photo");

  const [photoInfo, photoSizes] = await Promise.all([
    flickrApis.rest.photos.getInfo({
      credentials: flickrCredentialConfigs,
      photoId: replacedId,
    }),
    flickrApis.rest.photos.getSizes({
      credentials: flickrCredentialConfigs,
      photoId: replacedId,
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

export async function update({
  flickrId,
  integrity,
  file,
}: UpdateAndUploadParams): Promise<FlickrPhoto> {
  const existing = await getOneByIntegrity(integrity);

  if (!existing) throw new Error("Failed to get record to update");

  const flickrPhoto = await replace(
    flickrId,
    new File([file.buffer], file.name),
  );
  const id = await updateRecord({
    id: flickrPhoto.id,
    integrity,
    url: flickrPhoto.url,
    takenAt: flickrPhoto.takenAt,
    uploadedAt: flickrPhoto.uploadedAt,
    isPublic: flickrPhoto.isPublic,
  });

  if (!id) throw new Error("Failed to create a record");

  await flickrPhotoSizeRepository.batchDeleteById(id);
  await flickrPhotoSizeRepository.batchInsert(
    flickrPhoto.sizes.map((size) => ({
      ...size,
      flickrId: id,
    })),
  );

  const created = await getOne(id);

  if (!created) throw new Error("Failed to get created record");

  return created;
}
