import {
  getAllCategoriesCached,
  getAllCollarTypesCached,
  getAllFabricsCached,
  getAllSizesCached,
  getAllTagsCached,
} from "@/sanity/lib/collectionsPage/cache";
import FilterMobileClient from "./FilterMobile.client";

export default async function FilterMobile({
  hiddenFacets,
}: {
  hiddenFacets?: string[];
}) {
  const [sizes, categories, tags, fabrics, collarTypes] = await Promise.all([
    getAllSizesCached(),
    getAllCategoriesCached(),
    getAllTagsCached(),
    getAllFabricsCached(),
    getAllCollarTypesCached(),
  ]);

  return (
    <FilterMobileClient
      sizes={sizes}
      categories={categories}
      fabrics={fabrics}
      collarTypes={collarTypes}
      tags={tags}
      hiddenFacets={hiddenFacets}
    />
  );
}
