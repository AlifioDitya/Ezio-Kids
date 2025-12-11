// components/filters/FilterMobile.client.tsx
"use client";

import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FilterSheetContent from "./FilterSheetContent";

import type { Category, Size, Tag } from "@/sanity.types";
import type { CollarTypeOption } from "@/sanity/lib/collectionsPage/getAllCollarTypes";
import type { FabricOption } from "@/sanity/lib/collectionsPage/getAllFabrics";

type Props = {
  sizes: Size[];
  categories: Category[];
  fabrics: FabricOption[];
  collarTypes: CollarTypeOption[];
  tags: Tag[];
  hiddenFacets?: string[];
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
  fabrics,
  collarTypes,
  sizes,
  tags,
  categories,
  hiddenFacets = [],
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
  const selectedFabrics = React.useMemo(
    () => toArray(params.get("fabric")),
    [params]
  );
  const selectedCollars = React.useMemo(
    () => toArray(params.get("collar")),
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
    selectedFabrics.length +
    selectedCollars.length +
    selectedTags.length;

  const setParamList = React.useCallback(
    (
      key: "tcolor" | "size" | "cat" | "sleeve" | "tag" | "fabric" | "collar",
      next: string[]
    ) => {
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
  const onToggleFabric = (val: string) =>
    setParamList("fabric", toggle(selectedFabrics, val));
  const onToggleCollar = (slug: string) =>
    setParamList("collar", toggle(selectedCollars, slug));
  const onToggleTag = (slug: string) =>
    setParamList("tag", toggle(selectedTags, slug));

  const clearAll = () => {
    const q = new URLSearchParams(params.toString());
    [
      "tcolor",
      "size",
      "cat",
      "sleeve",
      "fabric",
      "collar",
      "tag",
      "page",
    ].forEach((k) => q.delete(k));
    replaceWithPrefetch(router, startTransition)(q);
    setOpen(false);
  };

  return (
    <>
      <div className="lg:hidden flex items-center">
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="flex items-center gap-2 rounded-xs shadow-none bg-white border-gray-300"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <p className="text-xs font-medium">Filters</p>
          {activeCount > 0 && (
            <Badge className="rounded-full px-2 py-0.5 text-[10px] bg-red-500 text-white h-5 w-5 justify-center">
              {activeCount}
            </Badge>
          )}
        </Button>
      </div>

      <FilterSheetContent
        open={open}
        setOpen={setOpen}
        sizes={sizes}
        categories={categories}
        fabrics={fabrics}
        collarTypes={collarTypes}
        tags={tags}
        hiddenFacets={hiddenFacets}
        selectedSizes={selectedSizes}
        selectedCategories={selectedCategories}
        selectedFabrics={selectedFabrics}
        selectedCollars={selectedCollars}
        selectedTags={selectedTags}
        selectedTrueColors={selectedTrueColors}
        selectedSleeves={selectedSleeves}
        onToggleSize={onToggleSize}
        onToggleCategory={onToggleCategory}
        onToggleFabric={onToggleFabric}
        onToggleCollar={onToggleCollar}
        onToggleTag={onToggleTag}
        onToggleTrueColor={onToggleTrueColor}
        onToggleSleeve={onToggleSleeve}
        onClearAll={clearAll}
        isPending={isPending}
      />
    </>
  );
}
