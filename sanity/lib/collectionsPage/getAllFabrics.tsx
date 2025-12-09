import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export type FabricOption = {
  name: string;
  image?: string | null;
};

export const getAllFabrics = async (): Promise<FabricOption[]> => {
  // Fetch all products with fabric names
  const GET_ALL_FABRICS_QUERY = defineQuery(
    `*[_type == "product" && defined(fabric.name)]{
      "name": fabric.name,
      "image": fabric.image.asset->url
    }`
  );

  const result = await sanityFetch({
    query: GET_ALL_FABRICS_QUERY,
  });

  const allFabrics = result.data || [];

  // Deduplicate by name, keeping the first definition found (or first with image)
  const uniqueFabrics = new Map<string, FabricOption>();

  for (const item of allFabrics) {
    if (item.name) {
      if (!uniqueFabrics.has(item.name)) {
        uniqueFabrics.set(item.name, { name: item.name, image: item.image });
      } else if (item.image && !uniqueFabrics.get(item.name)?.image) {
        // If we already have this fabric but without an image, update it if this one has an image
        uniqueFabrics.set(item.name, { name: item.name, image: item.image });
      }
    }
  }

  return Array.from(uniqueFabrics.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};
