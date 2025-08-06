// components/filters/FilterSidebarClient.tsx
"use client";

import { SizeFilter } from "@/components/filters/SizeFilter";
import SortDropdown from "@/components/filters/SortDropdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ComboboxItem } from "@/components/ui/combobox";
import type { Category, Size } from "@/sanity.types";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Separator } from "../ui/separator";
import CategoryFilter from "./CategoryFilter";
import GenderFilter, { GenderValue } from "./GenderFilter";

interface FilterSidebarClientProps {
  sizes: Size[];
  currentSort: "newest" | "price-asc" | "price-desc";
  categories: Category[];
}

export default function FilterSidebarClient({
  sizes,
  currentSort,
  categories,
}: FilterSidebarClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const sortOptions: ComboboxItem[] = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];

  const onSortChange = (newSort: string) => {
    startTransition(() => {
      const q = new URLSearchParams(Array.from(params.entries()));
      q.set("sort", newSort);
      q.delete("page");
      router.push(`/collections/shop-all?${q.toString()}`, { scroll: false });
      router.refresh();
    });
  };

  const [selectedSizes, setSelectedSizes] = React.useState<string[]>([]);
  const toggleSize = (label: string) =>
    setSelectedSizes((cur) =>
      cur.includes(label) ? cur.filter((l) => l !== label) : [...cur, label]
    );

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );
  const toggleCategory = (slug: string) =>
    setSelectedCategories((cur) =>
      cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]
    );

  const [gender, setGender] = React.useState<GenderValue | null>(null);

  return (
    <div className="hidden sm:flex w-64 gap-1 flex-col">
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

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="sizes">
          <AccordionTrigger className="font-semibold xl:text-lg">
            Size
          </AccordionTrigger>
          <AccordionContent>
            <SizeFilter
              sizes={sizes}
              selectedSizes={selectedSizes}
              onToggleSize={toggleSize}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Category Filter */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="sizes">
          <AccordionTrigger className="font-semibold xl:text-lg">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <CategoryFilter
              categories={categories}
              selectedSlugs={selectedCategories}
              onToggle={toggleCategory}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Gender Filter */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="sizes">
          <AccordionTrigger className="font-semibold xl:text-lg">
            Gender
          </AccordionTrigger>
          <AccordionContent>
            <GenderFilter
              value={gender}
              onChange={(v) => {
                setGender(v);
              }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
