// components/filters/TagFilter.tsx
"use client";

import CheckboxFilter, {
  type CheckboxItem,
} from "@/components/filters/CheckboxFilter";
import type { Tag } from "@/sanity.types";

export default function TagFilter({
  tags,
  selectedSlugs,
  onToggle,
}: {
  tags: Tag[];
  selectedSlugs: string[];
  onToggle: (slug: string) => void;
}) {
  const items: CheckboxItem[] = (tags ?? [])
    .map((t) => {
      const slug = t.slug?.current ?? t.slug ?? "";
      if (!slug) return null;
      return { value: slug, label: t.title ?? slug };
    })
    .filter(Boolean) as CheckboxItem[];

  return (
    <CheckboxFilter
      items={items}
      selected={selectedSlugs}
      onToggle={onToggle}
      size="sm"
      gapClassName="space-y-3"
    />
  );
}
