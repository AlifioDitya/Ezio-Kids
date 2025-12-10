// components/ui/SizeFilter.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Size } from "@/sanity.types";
import { usePathname } from "next/navigation";
import * as React from "react";

type Age = NonNullable<Size["ageGroup"]>;
type CollectionSlug = "new-arrival" | "baby-toddler" | "kids" | "teens";

export interface SizeFilterProps {
  /** All sizes from Sanity */
  sizes: Size[];
  /** Currently selected size labels */
  selectedSizes: string[];
  /** Toggle a size in/out of the selected list */
  onToggleSize: (sizeLabel: string) => void;
  /**
   * Optional: pass the current collections slug if you have it.
   * If omitted, the component will auto-detect from the URL.
   */
  collectionSlug?: CollectionSlug;
}

export function SizeFilter({
  sizes,
  selectedSizes,
  onToggleSize,
  collectionSlug,
}: SizeFilterProps) {
  const pathname = usePathname();

  // Detect slug from /collections/[slug] if not passed
  const detectedSlug = React.useMemo<CollectionSlug | undefined>(() => {
    if (collectionSlug) return collectionSlug;
    const m = pathname?.match(/\/collections\/([^/?#]+)/);
    const s = (m?.[1] ?? "") as CollectionSlug;
    return s || undefined;
  }, [pathname, collectionSlug]);

  // Full order (and labels)
  const ageGroupOrder = React.useMemo<Age[]>(
    () => ["baby", "toddler", "child", "teens"],
    []
  );
  const ageGroupLabels: Record<Age, string> = {
    baby: "Baby",
    toddler: "Toddler",
    child: "Kids",
    teens: "Teens",
  };

  // Map slug -> visible age groups
  const visibleAgeGroups = React.useMemo<Age[] | null>(() => {
    switch (detectedSlug) {
      case "baby-toddler":
        return ["baby", "toddler"];
      case "kids":
        return ["child"];
      case "teens":
        return ["teens"];
      default:
        return null; // show all for shop-all / new-arrival / unknown
    }
  }, [detectedSlug]);

  // Build a map: { baby: Size[], toddler: Size[], … }
  const grouped = React.useMemo(() => {
    const map: Partial<Record<Age, Size[]>> = {};
    for (const s of sizes) {
      if (!s.ageGroup || !s.label) continue;
      if (!map[s.ageGroup]) map[s.ageGroup] = [];
      map[s.ageGroup]!.push(s);
    }
    // sort each group by order (fallback 0)
    for (const key of ageGroupOrder) {
      map[key]?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    return map;
  }, [sizes, ageGroupOrder]);

  // Final list of groups to render
  const groupsToRender = (visibleAgeGroups ?? ageGroupOrder).filter(
    (g) => (grouped[g]?.length ?? 0) > 0
  );

  return (
    <div>
      {groupsToRender.map((groupKey) => {
        const group = grouped[groupKey]!;
        return (
          <div key={groupKey} className="">
            {groupsToRender.length > 1 && (
              <p className="text-xs font-semibold text-gray-500 mb-2 xl:text-base">
                {ageGroupLabels[groupKey]}
              </p>
            )}

            <div className="flex flex-wrap gap-1">
              {group.map((sz) => {
                const label = sz.label!; // guaranteed above
                const isSelected = selectedSizes.includes(label);
                return (
                  <Button
                    key={label}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "min-w-[2.5rem] text-xs justify-center shadow-none rounded-xs",
                      isSelected && "bg-blue-main text-white"
                    )}
                    onClick={() => onToggleSize(label)}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
