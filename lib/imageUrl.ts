import { client } from "@/sanity/lib/client";
import ImageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = ImageUrlBuilder(client);

export const imageUrl = (source: SanityImageSource) => {
  if (!source) {
    return null;
  }
  return builder.image(source);
};
