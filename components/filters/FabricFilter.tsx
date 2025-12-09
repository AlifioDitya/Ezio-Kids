"use client";

import { cn } from "@/lib/utils";
import type { FabricOption } from "@/sanity/lib/collectionsPage/getAllFabrics";
import Image from "next/image";

type Props = {
  fabrics: FabricOption[];
  selectedFabrics: string[];
  onToggleFabric: (fabric: string) => void;
};

export default function FabricFilter({
  fabrics,
  selectedFabrics,
  onToggleFabric,
}: Props) {
  if (!fabrics || fabrics.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 py-1">
      {fabrics.map((fabric) => {
        const checked = selectedFabrics.includes(fabric.name);
        return (
          <button
            key={fabric.name}
            type="button"
            onClick={() => onToggleFabric(fabric.name)}
            className="flex items-center gap-2 w-full text-left group"
          >
            {/* Avatar with Ring */}
            <div
              className={cn(
                "relative ml-1 h-8 w-8 overflow-hidden rounded-full border border-gray-100 flex-shrink-0 transition-all",
                checked
                  ? "ring-1 ring-gray-900 ring-offset-1"
                  : "group-hover:ring-1 group-hover:ring-gray-200 group-hover:ring-offset-1"
              )}
            >
              {fabric.image ? (
                <Image
                  src={fabric.image}
                  alt={fabric.name}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              ) : (
                <div className="h-full w-full bg-gray-100" />
              )}
            </div>

            {/* Label */}
            <span className={cn("text-xs", "text-gray-900")}>
              {fabric.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
