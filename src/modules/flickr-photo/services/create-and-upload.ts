import { type FlickrPhoto } from "database";
import dayjs from "dayjs";

import { create as createRecord, getOne } from "../repositories";

export interface CreateAndUploadParams {
  file: {
    buffer: Buffer;
  };
}

// TODO: implement
export async function create({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  file,
}: CreateAndUploadParams): Promise<FlickrPhoto> {
  const fakeId = BigInt(Math.floor(Math.random() * 100000000));

  const insertId = await createRecord({
    id: fakeId,
    url: `https://www.flickr.com/photos/fake/${fakeId}`,
    takenAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    uploadedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  });

  if (!insertId) throw new Error("Failed to create a record");

  const created = await getOne(insertId);

  if (!created) throw new Error("Failed to get created record");

  return created;
}
