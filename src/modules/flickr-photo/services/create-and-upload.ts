import { type FlickrPhoto } from "database";
import dayjs from "dayjs";

import { create as createRecord, getOne } from "../repositories";
import { getOneByIntegrity } from "../repositories/get-one-by-integrity";

export interface CreateAndUploadParams {
  integrity: string;
  file: {
    buffer: Buffer;
  };
}

// TODO: implement
export async function create({
  integrity,
}: CreateAndUploadParams): Promise<FlickrPhoto> {
  const fakeId = Math.floor(Math.random() * 100000000);
  const existing = await getOneByIntegrity(integrity);

  if (existing) return existing;

  const insertId = await createRecord({
    id: fakeId,
    integrity,
    url: `https://www.flickr.com/photos/fake/${fakeId}`,
    takenAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    uploadedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  });

  if (!insertId) throw new Error("Failed to create a record");

  const created = await getOne(insertId);

  if (!created) throw new Error("Failed to get created record");

  return created;
}
