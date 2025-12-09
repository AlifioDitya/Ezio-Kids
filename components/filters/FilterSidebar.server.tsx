// components/filters/FilterSidebar.server.tsx
import FilterSidebarClient from "@/components/filters/FilterSidebar.client";
import {
  getAllCategoriesCached,
  getAllCollarTypesCached,
  getAllFabricsCached,
  getAllSizesCached,
  getAllTagsCached,
} from "@/sanity/lib/collectionsPage/cache";

export default async function FilterSidebar({
  currentSort,
}: {
  currentSort: "newest" | "price-asc" | "price-desc";
}) {
  const [sizes, categories, tags, fabrics, collarTypes] = await Promise.all([
    getAllSizesCached(),
    getAllCategoriesCached(),
    getAllTagsCached(),
    getAllFabricsCached(),
    getAllCollarTypesCached(),
  ]);

  return (
    <FilterSidebarClient
      sizes={sizes}
      categories={categories}
      fabrics={fabrics}
      collarTypes={collarTypes}
      tags={tags}
      currentSort={currentSort}
    />
  );
}
