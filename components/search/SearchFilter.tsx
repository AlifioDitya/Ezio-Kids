"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Category, Size, Tag } from "@/sanity.types";
import type { CollarTypeOption } from "@/sanity/lib/collectionsPage/getAllCollarTypes";
import type { FabricOption } from "@/sanity/lib/collectionsPage/getAllFabrics";
import { SlidersHorizontal } from "lucide-react";
import * as React from "react";
import FilterSheetContent from "../filters/FilterSheetContent";

type Props = {
  // Data
  sizes: Size[];
  categories: Category[];
  fabrics: FabricOption[];
  collarTypes: CollarTypeOption[];
  tags: Tag[];

  // State
  selectedSizes: string[];
  selectedCategories: string[];
  selectedFabrics: string[];
  selectedCollars: string[];
  selectedTags: string[];
  selectedTrueColors: string[];
  selectedSleeves: string[];

  // Handlers
  onToggleSize: (label: string) => void;
  onToggleCategory: (slug: string) => void;
  onToggleFabric: (val: string) => void;
  onToggleCollar: (slug: string) => void;
  onToggleTag: (slug: string) => void;
  onToggleTrueColor: (val: string) => void;
  onToggleSleeve: (slug: string) => void;
  onClearAll: () => void;
};

export default function SearchFilter(props: Props) {
  const [open, setOpen] = React.useState(false);

  const activeCount =
    props.selectedTrueColors.length +
    props.selectedSizes.length +
    props.selectedCategories.length +
    props.selectedSleeves.length +
    props.selectedFabrics.length +
    props.selectedCollars.length +
    props.selectedTags.length;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="flex bg-white shadow-none items-center h-11 gap-2 rounded-full border-gray-200 px-3 hover:bg-gray-50"
      >
        <SlidersHorizontal className="h-4 w-4 text-gray-700" />
        <span className="hidden sm:inline text-sm font-medium text-gray-700">
          Filters
        </span>
        {activeCount > 0 && (
          <Badge className="ml-0.5 rounded-full px-1.5 py-0 text-[10px] bg-red-500 text-white h-6 min-w-6 justify-center">
            {activeCount}
          </Badge>
        )}
      </Button>

      <FilterSheetContent
        open={open}
        setOpen={setOpen}
        {...props}
        isPending={false}
      />
    </>
  );
}
