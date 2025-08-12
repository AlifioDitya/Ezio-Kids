// components/filters/CategoryFilter.tsx
"use client";

import CheckboxFilter, {
  type CheckboxItem,
} from "@/components/filters/CheckboxFilter";
import type { Category } from "@/sanity.types";

export interface CategoryFilterProps {
  categories: Category[];
  selectedSlugs: string[];
  onToggle: (slug: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedSlugs,
  onToggle,
}: CategoryFilterProps) {
  const items: CheckboxItem[] = (categories ?? [])
    .map((c) => {
      const slug = c.slug?.current ?? "";
      if (!slug) return null;
      return {
        value: slug,
        label: c.name ?? slug,
      };
    })
    .filter(Boolean) as CheckboxItem[];

  return (
    <CheckboxFilter
      items={items}
      selected={selectedSlugs}
      onToggle={onToggle}
      size="md"
      gapClassName="space-y-3"
    />
  );
}
