"use client";

import { TRUE_COLOR_OPTIONS } from "@/app/lib/constant";
import { cn } from "@/lib/utils";
import type { Category, Size, Tag } from "@/sanity.types";

import CategoryFilter from "@/components/filters/CategoryFilter";
import CollarTypeFilter from "@/components/filters/CollarTypeFilter";
import FabricFilter from "@/components/filters/FabricFilter";
import { SizeFilter } from "@/components/filters/SizeFilter";
import SleeveLengthFilter from "@/components/filters/SleeveLengthFilter";
import TagFilter from "@/components/filters/TagFilter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CollarTypeOption } from "@/sanity/lib/collectionsPage/getAllCollarTypes";
import type { FabricOption } from "@/sanity/lib/collectionsPage/getAllFabrics";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  sizes: Size[];
  categories: Category[];
  fabrics: FabricOption[];
  collarTypes: CollarTypeOption[];
  tags: Tag[];
  hiddenFacets?: string[];

  // Selected State
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

  isPending?: boolean;
};

export default function FilterSheetContent({
  open,
  setOpen,
  sizes,
  categories,
  fabrics,
  collarTypes,
  tags,
  hiddenFacets = [],
  selectedSizes,
  selectedCategories,
  selectedFabrics,
  selectedCollars,
  selectedTags,
  selectedTrueColors,
  selectedSleeves,
  onToggleSize,
  onToggleCategory,
  onToggleFabric,
  onToggleCollar,
  onToggleTag,
  onToggleTrueColor,
  onToggleSleeve,
  onClearAll,
  isPending = false,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="p-0 w-full lg:max-w-sm z-[99]">
        <SheetHeader className="px-5 py-4 border-b">
          <div className="flex flex-col gap-3">
            <SheetTitle className="text-base">Filters</SheetTitle>
          </div>
        </SheetHeader>

        <div className="h-full overflow-y-auto px-5 py-4 space-y-6">
          {/* Color */}
          <div>
            <p className="mb-4 text-xs font-semibold text-gray-800">Color</p>
            <TooltipProvider delayDuration={150}>
              <div className="flex flex-wrap gap-2">
                {TRUE_COLOR_OPTIONS.map((opt) => {
                  const active = selectedTrueColors.includes(opt.value);
                  return (
                    <Tooltip key={opt.value}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => onToggleTrueColor(opt.value)}
                          aria-pressed={active}
                          title={opt.label}
                          className={cn(
                            "h-9 w-9 rounded-full border transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900",
                            "overflow-hidden",
                            active ? "ring-2 ring-gray-900" : "hover:scale-105"
                          )}
                          style={{ background: opt.css }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <span className="text-xs">{opt.label}</span>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>

          <Separator />

          {/* Size */}
          <div>
            <p className="mb-4 text-xs font-semibold text-gray-800">Size</p>
            <SizeFilter
              sizes={sizes}
              selectedSizes={selectedSizes}
              onToggleSize={onToggleSize}
            />
          </div>

          <Separator />

          {/* Categories */}
          <div>
            <p className="mb-3 text-xs font-semibold text-gray-800">Design</p>
            <CategoryFilter
              categories={categories}
              selectedSlugs={selectedCategories}
              onToggle={onToggleCategory}
            />
          </div>

          <Separator />

          {/* Fabric */}
          {!hiddenFacets.includes("fabric") && (
            <>
              <div>
                <p className="mb-3 text-xs font-semibold text-gray-800">
                  Fabric
                </p>
                <FabricFilter
                  fabrics={fabrics}
                  selectedFabrics={selectedFabrics}
                  onToggleFabric={onToggleFabric}
                />
              </div>
              <Separator />
            </>
          )}

          {/* Collar Types */}
          {!hiddenFacets.includes("collar") && (
            <>
              <div>
                <p className="mb-3 text-xs font-semibold text-gray-800">
                  Collar Type
                </p>
                <CollarTypeFilter
                  collarTypes={collarTypes}
                  selectedCollars={selectedCollars}
                  onToggleCollar={onToggleCollar}
                />
              </div>
              <Separator />
            </>
          )}

          {/* Sleeve */}
          <div>
            <p className="mb-3 text-xs font-semibold text-gray-800">
              Sleeve Length
            </p>
            <SleeveLengthFilter
              selectedSlugs={selectedSleeves}
              onToggle={onToggleSleeve}
            />
          </div>

          <Separator />

          {/* Tags */}
          <div>
            <p className="mb-3 text-xs font-semibold text-gray-800">Tags</p>
            <TagFilter
              tags={tags}
              selectedSlugs={selectedTags}
              onToggle={onToggleTag}
            />
          </div>
        </div>

        <SheetFooter className="px-5 py-4 border-t">
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setOpen(false);
                onClearAll();
              }}
              disabled={isPending}
            >
              Clear
            </Button>
            <Button
              className="flex-1 bg-blue-main hover:bg-blue-main/90 text-white"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
