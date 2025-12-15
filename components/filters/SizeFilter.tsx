// components/ui/SizeFilter.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Size } from "@/sanity.types";
import * as React from "react";

type Age = NonNullable<Size["ageGroup"]>;

export interface SizeFilterProps {
  /** All sizes from Sanity */
  sizes: Size[];
  /** Currently selected size labels */
  selectedSizes: string[];
  /** Toggle a size in/out of the selected list */
  onToggleSize: (sizeLabel: string) => void;
}

export function SizeFilter({
  sizes,
  selectedSizes,
  onToggleSize,
}: SizeFilterProps) {
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
  const groupsToRender = ageGroupOrder.filter(
    (g) => (grouped[g]?.length ?? 0) > 0
  );

  return (
    <div className="flex flex-col gap-4">
      {groupsToRender.map((groupKey) => {
        const group = grouped[groupKey]!;
        return (
          <div key={groupKey} className="flex flex-col">
            {groupsToRender.length > 1 && (
              <p className="text-xs font-semibold text-gray-500 mb-2">
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
