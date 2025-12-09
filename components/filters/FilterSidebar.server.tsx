// components/filters/FilterSidebar.server.tsx
import FilterSidebarClient from "@/components/filters/FilterSidebar.client";
import {
  getAllCategoriesCached,
  getAllFabricsCached,
  getAllSizesCached,
  getAllTagsCached,
} from "@/sanity/lib/collectionsPage/cache";

export default async function FilterSidebar({
  currentSort,
}: {
  currentSort: "newest" | "price-asc" | "price-desc";
}) {
  const [sizes, categories, tags, fabrics] = await Promise.all([
    getAllSizesCached(),
    getAllCategoriesCached(),
    getAllTagsCached(),
    getAllFabricsCached(),
  ]);

  return (
    <FilterSidebarClient
      sizes={sizes}
      categories={categories}
      fabrics={fabrics}
      tags={tags}
      currentSort={currentSort}
    />
  );
}
