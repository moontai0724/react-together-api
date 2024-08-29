import { flickrApis } from "@moontai0724/flickr-sdk";
import { flickrConfigs } from "configs";
import { asyncExitHook } from "exit-hook";

console.log("placeholder photo loading...");

async function getOnePixelImageFile() {
  const onePixelImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjmHnz1X8AB8cDXJH2s1sAAAAASUVORK5CYII=";
  const res: Response = await fetch(onePixelImage);
  const blob: Blob = await res.blob();

  return new File([blob], "placeholder.png", { type: "image/png" });
}

export const placeholderPhotoId = await flickrApis.upload
  .upload({
    credentials: flickrConfigs.credentials,
    photo: await getOnePixelImageFile(),
  })
  .then((id) => {
    console.log("placeholder photo created:", id);

    return id;
  });

asyncExitHook(
  async (event) => {
    console.log(
      `received ${event}, removing placeholder photo before exiting... `,
    );

    await flickrApis.rest.photos.delete({
      credentials: flickrConfigs.credentials,
      photoId: placeholderPhotoId,
    });

    console.log("placeholder photo removed.");
  },
  {
    wait: 60000,
  },
);
