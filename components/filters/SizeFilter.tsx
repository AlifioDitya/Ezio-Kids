// components/ui/SizeFilter.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Size } from "@/sanity.types";
import * as React from "react";

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
  // The groups in display order
  const ageGroupOrder = React.useMemo<NonNullable<Size["ageGroup"]>[]>(
    () => ["baby", "toddler", "child", "youth"],
    []
  );

  // Friendly headings
  const ageGroupLabels: Record<NonNullable<Size["ageGroup"]>, string> = {
    baby: "Baby",
    toddler: "Toddler",
    child: "Kids",
    youth: "Youth",
  };

  // Build a map: { baby: Size[], toddler: Size[], … }
  const grouped = React.useMemo(() => {
    const map: Partial<Record<NonNullable<Size["ageGroup"]>, Size[]>> = {};

    for (const s of sizes) {
      // skip if no ageGroup or no label
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

  return (
    <div>
      {ageGroupOrder.map((groupKey) => {
        const group = grouped[groupKey];
        if (!group || group.length === 0) return null;

        return (
          <div key={groupKey} className="mb-4 lg:mb-6">
            {/* Group heading */}
            <p className="text-xs font-semibold text-gray-500 mb-2 xl:text-base">
              {ageGroupLabels[groupKey]}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-1">
              {group.map((sz) => {
                // sz.label is now guaranteed non-null
                const label = sz.label!;
                const isSelected = selectedSizes.includes(label);

                return (
                  <Button
                    key={label}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "min-w-[3rem] justify-center shadow-none rounded-xs",
                      isSelected && "bg-gray-900 text-white"
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
