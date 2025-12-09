import {
  getAllCategoriesCached,
  getAllFabricsCached,
  getAllSizesCached,
  getAllTagsCached,
} from "@/sanity/lib/collectionsPage/cache";
import FilterMobileClient from "./FilterMobile.client";

export default async function FilterMobile() {
  const [sizes, categories, tags, fabrics] = await Promise.all([
    getAllSizesCached(),
    getAllCategoriesCached(),
    getAllTagsCached(),
    getAllFabricsCached(),
  ]);

  return (
    <FilterMobileClient
      sizes={sizes}
      categories={categories}
      fabrics={fabrics}
      tags={tags}
    />
  );
}
