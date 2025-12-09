"use client";

import { cn } from "@/lib/utils";
import type { CollarTypeOption } from "@/sanity/lib/collectionsPage/getAllCollarTypes";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  collarTypes: CollarTypeOption[];
};

export default function CollarTypeFilter({ collarTypes }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  // "collar" param holds comma-separated slugs
  const selectedCollars = new Set(
    params.get("collar")?.split(",").filter(Boolean) || []
  );

  const toggleCollar = (slug: string) => {
    const next = new Set(selectedCollars);
    if (next.has(slug)) {
      next.delete(slug);
    } else {
      next.add(slug);
    }

    const newParams = new URLSearchParams(params.toString());
    const arr = Array.from(next);
    if (arr.length > 0) {
      newParams.set("collar", arr.join(","));
    } else {
      newParams.delete("collar");
    }
    // Reset page to 1
    newParams.delete("page");
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  if (!collarTypes || collarTypes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 pt-2">
      {collarTypes.map((c) => {
        const isSelected = selectedCollars.has(c.slug);
        return (
          <button
            key={c.slug}
            onClick={() => toggleCollar(c.slug)}
            title={c.name}
            className="flex items-center gap-2"
          >
            <div
              className={cn(
                "relative ml-1 h-8 w-8 rounded-full overflow-hidden border transition-all",
                isSelected
                  ? "ring-1 ring-offset-1 ring-gray-900 border-gray-900"
                  : "border-gray-200 hover:border-gray-400"
              )}
            >
              {c.image && (
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <p className="text-xs text-gray-800">{c.name}</p>
          </button>
        );
      })}
    </div>
  );
}
