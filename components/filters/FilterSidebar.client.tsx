// components/filters/FilterSidebar.client.tsx
"use client";

import { TRUE_COLOR_OPTIONS } from "@/app/lib/constant";
import { ComboboxItem } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import type { Category, Size, Tag } from "@/sanity.types";
import type { CollarTypeOption } from "@/sanity/lib/collectionsPage/getAllCollarTypes";
import type { FabricOption } from "@/sanity/lib/collectionsPage/getAllFabrics";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import CategoryFilter from "./CategoryFilter";
import CollarTypeFilter from "./CollarTypeFilter";
import FabricFilter from "./FabricFilter";
import { SizeFilter } from "./SizeFilter";
import SleeveLengthFilter from "./SleeveLengthFilter";
import SortDropdown from "./SortDropdown";
import TagFilter from "./TagFilter";

interface FilterSidebarClientProps {
  sizes: Size[];
  categories: Category[];
  fabrics: FabricOption[];
  collarTypes: CollarTypeOption[];
  tags: Tag[];
  currentSort: "newest" | "price-asc" | "price-desc";
  initialSelectedSizes?: string[];
  initialSelectedCategories?: string[];
  initialSelectedSleeves?: string[];
  hiddenFacets?: string[];
}

const getBasePath = () =>
  typeof window !== "undefined" ? window.location.pathname : "";

function replaceWithPrefetch(
  router: ReturnType<typeof useRouter>,
  startTransition: React.TransitionStartFunction
) {
  return (q: URLSearchParams) => {
    const href = `${getBasePath()}?${q.toString()}`;
    router.prefetch(href);
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };
}

const csv = (arr: string[]) => arr.filter(Boolean).join(",");

export default function FilterSidebarClient({
  sizes,
  categories,
  fabrics,
  collarTypes,
  tags,
  currentSort,
  hiddenFacets = [],
}: FilterSidebarClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  // Parse current URL -> arrays (single source of truth)
  const selectedTrueColors = React.useMemo(
    () => (params.get("tcolor") ?? "").split(",").filter(Boolean),
    [params]
  );
  const selectedSizes = React.useMemo(
    () => (params.get("size") ?? "").split(",").filter(Boolean),
    [params]
  );
  const selectedCategories = React.useMemo(
    () => (params.get("cat") ?? "").split(",").filter(Boolean),
    [params]
  );
  const selectedSleeves = React.useMemo(
    () => (params.get("sleeve") ?? "").split(",").filter(Boolean),
    [params]
  );
  const selectedFabrics = React.useMemo(
    () => (params.get("fabric") ?? "").split(",").filter(Boolean),
    [params]
  );
  const selectedCollars = React.useMemo(
    () => (params.get("collar") ?? "").split(",").filter(Boolean),
    [params]
  );
  const selectedTags = React.useMemo(
    () => (params.get("tag") ?? "").split(",").filter(Boolean),
    [params]
  );

  const hasAnyFilter =
    selectedTrueColors.length ||
    selectedSizes.length ||
    selectedCategories.length ||
    selectedSleeves.length ||
    selectedFabrics.length ||
    selectedCollars.length ||
    selectedTags.length;

  // Helper: write arrays back to URL and reset page (stay on current route)
  const setParamList = React.useCallback(
    (
      key: "tcolor" | "size" | "cat" | "sleeve" | "tag" | "fabric" | "collar",
      next: string[]
    ) => {
      startTransition(() => {
        const q = new URLSearchParams(params.toString());
        if (next.length) q.set(key, csv(next));
        else q.delete(key);
        q.delete("page");
        replaceWithPrefetch(router, startTransition)(q);
      });
    },
    [params, router, startTransition]
  );

  // SORT — instant apply
  const sortOptions: ComboboxItem[] = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];
  const onSortChange = (newSort: string) => {
    startTransition(() => {
      const q = new URLSearchParams(params.toString());
      q.set("sort", newSort);
      q.delete("page");
      replaceWithPrefetch(router, startTransition)(q);
    });
  };

  // Toggle helpers
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
  const onToggleFabric = (val: string) =>
    setParamList("fabric", toggle(selectedFabrics, val));
  const onToggleCollar = (slug: string) =>
    setParamList("collar", toggle(selectedCollars, slug));
  const onToggleTag = (slug: string) =>
    setParamList("tag", toggle(selectedTags, slug));

  // Clear all
  const clearAll = () => {
    startTransition(() => {
      const q = new URLSearchParams(params.toString());
      q.delete("tcolor");
      q.delete("size");
      q.delete("cat");
      q.delete("sleeve");
      q.delete("fabric");
      q.delete("collar");
      q.delete("tag");
      q.delete("page");
      replaceWithPrefetch(router, startTransition)(q);
    });
  };

  // ----- Active filter badges -----
  const categoryLabel = (slug: string) =>
    categories.find((c) => c.slug?.current === slug)?.name ?? slug;

  const sleeveLabel = (v: string) =>
    (({ short: "Short Sleeve", long: "Long Sleeve" }) as const)[
      v as "short" | "long"
    ] ?? v;

  const tagLabel = (slug: string) =>
    tags.find((t) => t.slug?.current === slug)?.title ?? slug;

  const trueColorLabel = (v: string) =>
    TRUE_COLOR_OPTIONS.find((o) => o.value === v)?.label ?? v;

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [
    ...selectedTrueColors.map((c) => ({
      key: `tcolor:${c}`,
      label: trueColorLabel(c),
      onRemove: () => onToggleTrueColor(c),
    })),
    ...selectedSizes.map((s) => ({
      key: `size:${s}`,
      label: s,
      onRemove: () => onToggleSize(s),
    })),
    ...selectedCategories.map((c) => ({
      key: `cat:${c}`,
      label: categoryLabel(c),
      onRemove: () => onToggleCategory(c),
    })),
    ...selectedSleeves.map((sl) => ({
      key: `sleeve:${sl}`,
      label: sleeveLabel(sl),
      onRemove: () => onToggleSleeve(sl),
    })),
    ...selectedFabrics.map((slug) => {
      const fabricName = fabrics.find((f) => f.slug === slug)?.name || slug;
      return {
        key: `fabric:${slug}`,
        label: fabricName,
        onRemove: () => onToggleFabric(slug),
      };
    }),
    ...selectedCollars.map((slug) => {
      const collarName = collarTypes.find((c) => c.slug === slug)?.name || slug;
      return {
        key: `collar:${slug}`,
        label: collarName,
        onRemove: () => onToggleCollar(slug),
      };
    }),
    ...selectedTags.map((t) => ({
      key: `tag:${t}`,
      label: tagLabel(t),
      onRemove: () => onToggleTag(t),
    })),
  ];

  const enableSort = false; // Change later if we need sorting

  return (
    <aside className="hidden sm:flex w-48 gap-1 flex-col">
      {/* Sort */}
      <div className="flex flex-col gap-2 w-full">
        {enableSort && (
          <SortDropdown
            id="filter-sort"
            label="Sort"
            items={sortOptions}
            value={currentSort}
            onChange={onSortChange}
            placeholder="Sort"
            widthClassName="w-full"
            disabled={isPending}
          />
        )}

        {/* Active filters */}
        {hasAnyFilter ? (
          <>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">
                Active Filters
              </span>
              <button
                type="button"
                onClick={clearAll}
                disabled={!hasAnyFilter || isPending}
                className="text-xs text-gray-600 hover:text-gray-900 underline disabled:opacity-40"
              >
                Clear All
              </button>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {chips.map(({ key, label, onRemove }) => (
                <Badge
                  key={key}
                  variant="secondary"
                  className="rounded-full border border-gray-300 bg-white px-2.5 py-1 text-[12px] font-medium flex items-center"
                >
                  <span className="truncate text-xs">{label}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${label}`}
                    onClick={onRemove}
                    className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-gray-200"
                  >
                    <X className="h-3 w-3 text-gray-600" />
                  </button>
                </Badge>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* True Color filter */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="true-color">
          <AccordionTrigger className="font-semibold text-xs">
            Color
          </AccordionTrigger>
          <AccordionContent>
            <TooltipProvider delayDuration={150}>
              <div className="flex flex-wrap gap-2 py-2 px-1.5">
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
                            "h-8 w-8 rounded-full border transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900",
                            "overflow-hidden",
                            active ? "ring-1 ring-gray-900" : "hover:scale-105"
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Size */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="size">
          <AccordionTrigger className="font-semibold text-xs">
            Size
          </AccordionTrigger>
          <AccordionContent>
            <SizeFilter
              sizes={sizes}
              selectedSizes={selectedSizes}
              onToggleSize={onToggleSize}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Categories */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="font-semibold text-xs">
            Design
          </AccordionTrigger>
          <AccordionContent>
            <CategoryFilter
              categories={categories}
              selectedSlugs={selectedCategories}
              onToggle={onToggleCategory}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Fabric */}
      {!hiddenFacets.includes("fabric") && (
        <>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="fabric">
              <AccordionTrigger className="font-semibold text-xs">
                Fabric
              </AccordionTrigger>
              <AccordionContent>
                <FabricFilter
                  fabrics={fabrics}
                  selectedFabrics={selectedFabrics}
                  onToggleFabric={onToggleFabric}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator />
        </>
      )}

      {/* Collar Types */}
      {!hiddenFacets.includes("collar") && (
        <>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="collar">
              <AccordionTrigger className="font-semibold text-xs">
                Collar Type
              </AccordionTrigger>
              <AccordionContent>
                <CollarTypeFilter
                  collarTypes={collarTypes}
                  selectedCollars={selectedCollars}
                  onToggleCollar={onToggleCollar}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator />
        </>
      )}

      {/* Sleeve */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="sleeve">
          <AccordionTrigger className="font-semibold text-xs">
            Sleeve Length
          </AccordionTrigger>
          <AccordionContent>
            <SleeveLengthFilter
              selectedSlugs={selectedSleeves}
              onToggle={onToggleSleeve}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Tags */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="tags">
          <AccordionTrigger className="font-semibold text-xs">
            Tags
          </AccordionTrigger>
          <AccordionContent>
            <TagFilter
              tags={tags}
              selectedSlugs={selectedTags}
              onToggle={onToggleTag}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
