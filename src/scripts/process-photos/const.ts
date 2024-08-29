import { flickrApis } from "@moontai0724/flickr-sdk";
import { flickrConfigs } from "configs";

console.log("placeholder photo loading...");

export const placeholderPhotoId = await flickrApis.upload
  .upload({
    credentials: flickrConfigs.credentials,
    photo: await (async () => {
      const onePx =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjmHnz1X8AB8cDXJH2s1sAAAAASUVORK5CYII=";
      const res: Response = await fetch(onePx);
      const blob: Blob = await res.blob();

      return new File([blob], "placeholder.png", { type: "image/png" });
    })(),
  })
  .then((id) => {
    console.log("placeholder photo created:", id);

    return id;
  });
