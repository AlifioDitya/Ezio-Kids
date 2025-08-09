// components/filters/SidebarServer.tsx
import FilterSidebarClient from "@/components/filters/FilterSidebarClient";
import {
  getAllCategoriesCached,
  getAllSizesCached,
  getAllTagsCached,
} from "@/sanity/lib/collectionsPage/cache";

export default async function SidebarServer({
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
