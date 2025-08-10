// components/filters/FilterSidebar.server.tsx
import FilterSidebarClient from "@/components/filters/FilterSidebar.client";
import {
  getAllCategoriesCached,
  getAllSizesCached,
  getAllTagsCached,
} from "@/sanity/lib/collectionsPage/cache";

export default async function FilterSidebar({
  currentSort,
}: {
  currentSort: "newest" | "price-asc" | "price-desc";
}) {
  const [sizes, categories, tags] = await Promise.all([
    getAllSizesCached(),
    getAllCategoriesCached(),
    getAllTagsCached(),
  ]);

  return (
    <FilterSidebarClient
      sizes={sizes}
      categories={categories}
      tags={tags}
      currentSort={currentSort}
    />
  );
}
