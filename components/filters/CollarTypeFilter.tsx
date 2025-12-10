"use client";

import { cn } from "@/lib/utils";
import type { CollarTypeOption } from "@/sanity/lib/collectionsPage/getAllCollarTypes";
import Image from "next/image";

type Props = {
  collarTypes: CollarTypeOption[];
  selectedCollars: string[];
  onToggleCollar: (slug: string) => void;
};

export default function CollarTypeFilter({
  collarTypes,
  selectedCollars,
  onToggleCollar,
}: Props) {
  if (!collarTypes || collarTypes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 pt-2">
      {collarTypes.map((c) => {
        const isSelected = selectedCollars.includes(c.slug);
        return (
          <button
            key={c.slug}
            onClick={() => onToggleCollar(c.slug)}
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
