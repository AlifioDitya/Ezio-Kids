"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category, Size, Tag } from "@/sanity.types";
import { TRUE_COLOR_OPTIONS } from "@/app/constant";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SortDropdown from "@/components/filters/SortDropdown";
import { SizeFilter } from "@/components/filters/SizeFilter";
import CategoryFilter from "@/components/filters/CategoryFilter";
import SleeveLengthFilter from "@/components/filters/SleeveLengthFilter";
import TagFilter from "@/components/filters/TagFilter";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  sizes: Size[];
  categories: Category[];
  tags: Tag[];
  currentSort: "newest" | "price-asc" | "price-desc";
};

const csv = (arr: string[]) => arr.filter(Boolean).join(",");
const toArray = (v?: string | string[] | null) =>
  !v ? [] : Array.isArray(v) ? v : v.split(",").filter(Boolean);

const getBasePath = () =>
  typeof window !== "undefined" ? window.location.pathname : "";

function replaceWithPrefetch(
  router: ReturnType<typeof useRouter>,
  startTransition: React.TransitionStartFunction
) {
  return (q: URLSearchParams) => {
    const href = `${getBasePath()}?${q.toString()}`;
    router.prefetch(href);
    startTransition(() => router.replace(href, { scroll: false }));
  };
}

export default function FilterMobileClient({
  sizes,
  categories,
  tags,
  currentSort,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  // URL state (single source of truth)
  const selectedTrueColors = React.useMemo(
    () => toArray(params.get("tcolor")),
    [params]
  );
  const selectedSizes = React.useMemo(
    () => toArray(params.get("size")),
    [params]
  );
  const selectedCategories = React.useMemo(
    () => toArray(params.get("cat")),
    [params]
  );
  const selectedSleeves = React.useMemo(
    () => toArray(params.get("sleeve")),
    [params]
  );
  const selectedTags = React.useMemo(
    () => toArray(params.get("tag")),
    [params]
  );

  const activeCount =
    selectedTrueColors.length +
    selectedSizes.length +
    selectedCategories.length +
    selectedSleeves.length +
    selectedTags.length;

  const setParamList = React.useCallback(
    (key: "tcolor" | "size" | "cat" | "sleeve" | "tag", next: string[]) => {
      const q = new URLSearchParams(params.toString());
      if (next.length) q.set(key, csv(next));
      else q.delete(key);
      q.delete("page");
      replaceWithPrefetch(router, startTransition)(q);
    },
    [params, router, startTransition]
  );

  const toggle = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const onToggleTrueColor = (val: string) =>
    setParamList("tcolor", toggle(selectedTrueColors, val));
  const onToggleSize = (label: string) =>
    setParamList("size", toggle(selectedSizes, label));
  const onToggleCategory = (slug: string) =>
    setParamList("cat", toggle(selectedCategories, slug));
  const onToggleSleeve = (slug: string) =>
    setParamList("sleeve", toggle(selectedSleeves, slug));
  const onToggleTag = (slug: string) =>
    setParamList("tag", toggle(selectedTags, slug));

  const clearAll = () => {
    const q = new URLSearchParams(params.toString());
    ["tcolor", "size", "cat", "sleeve", "tag", "page"].forEach((k) =>
      q.delete(k)
    );
    replaceWithPrefetch(router, startTransition)(q);
  };

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];

  const onSortChange = (newSort: string) => {
    const q = new URLSearchParams(params.toString());
    q.set("sort", newSort);
    q.delete("page");
    replaceWithPrefetch(router, startTransition)(q);
  };

  // Top trigger bar (mobile-only)
  return (
    <>
      <div className="sm:hidden flex items-center gap-2">
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="flex items-center gap-2 rounded-xs shadow-none bg-white"
        >
          <SlidersHorizontal className="h-4 w-4 text-xs" />
          Filters
          {activeCount > 0 && (
            <Badge className="ml-1 rounded-full px-2 py-0.5 text-[10px] bg-red-500 text-white h-5 w-5">
              {activeCount}
            </Badge>
          )}
        </Button>

        <div className="flex-1">
          <SortDropdown
            id="mobile-sort"
            label="Sort"
            items={sortOptions}
            value={currentSort}
            onChange={onSortChange}
            placeholder="Sort"
            widthClassName="w-full"
            disabled={isPending}
          />
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-full sm:max-w-sm">
          <SheetHeader className="px-5 py-4 border-b">
            <div className="flex flex-col gap-3">
              <SheetTitle className="text-base">Filters</SheetTitle>
            </div>
          </SheetHeader>

          <div className="h-full overflow-y-auto px-5 py-4 space-y-6">
            {/* Color */}
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-800">Color</p>
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
                              active
                                ? "ring-2 ring-gray-900"
                                : "hover:scale-105"
                            )}
                            style={{ background: opt.css }}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <span className="text-sm">{opt.label}</span>
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
              <p className="mb-3 text-sm font-semibold text-gray-800">Size</p>
              <SizeFilter
                sizes={sizes}
                selectedSizes={selectedSizes}
                onToggleSize={onToggleSize}
              />
            </div>

            <Separator />

            {/* Categories */}
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-800">
                Categories
              </p>
              <CategoryFilter
                categories={categories}
                selectedSlugs={selectedCategories}
                onToggle={onToggleCategory}
              />
            </div>

            <Separator />

            {/* Sleeve */}
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-800">
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
              <p className="mb-3 text-sm font-semibold text-gray-800">Tags</p>
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
                onClick={clearAll}
                disabled={isPending}
              >
                Clear
              </Button>
              <Button
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
