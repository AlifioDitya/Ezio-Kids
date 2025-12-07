// components/filters/CheckboxFilter.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import * as React from "react";

export type CheckboxItem = {
  /** Unique value you store in state/URL (e.g., "girls", "tops") */
  value: string;
  /** Human label to show */
  label: string;
  /** Optional: disable item */
  disabled?: boolean;
  /** Optional: secondary text (small, muted) */
  description?: string;
};

export interface CheckboxFilterProps {
  /** List of selectable items */
  items: CheckboxItem[];
  /** Controlled selected values */
  selected: string[];
  /** Toggle a single value */
  onToggle: (value: string) => void;

  /** Optional UI controls */
  className?: string;
  size?: "sm" | "md";
  /** Show a client-side search box */
  searchable?: boolean;
  searchPlaceholder?: string;

  /** Show quick actions */
  showActions?: boolean;
  onClearAll?: () => void;
  onSelectAll?: () => void;

  /** Layout tweak */
  gapClassName?: string; // e.g. "space-y-2" (default) or "space-y-1"
}

export default function CheckboxFilter({
  items,
  selected,
  onToggle,
  className,
  size = "md",
  searchable = false,
  searchPlaceholder = "Search...",
  showActions = false,
  onClearAll,
  onSelectAll,
  gapClassName = "space-y-2",
}: CheckboxFilterProps) {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(term) ||
        it.value.toLowerCase().includes(term)
    );
  }, [items, q]);

  const labelTextClass =
    size === "sm" ? "text-xs text-gray-800" : "text-sm text-gray-800";
  const descriptionClass =
    size === "sm" ? "text-[11px] text-gray-500" : "text-xs text-gray-500";

  return (
    <div className={cn("w-full", className)}>
      {searchable && (
        <div className="mb-2">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border bg-white px-2 py-1.5 text-sm outline-none ring-0 focus:border-gray-400"
          />
        </div>
      )}

      {showActions && (
        <div className="mb-2 flex items-center gap-2">
          {onSelectAll && (
            <button
              type="button"
              className="text-xs font-medium text-gray-700 hover:text-gray-900 underline"
              onClick={onSelectAll}
            >
              Select all
            </button>
          )}
          {onClearAll && (
            <button
              type="button"
              className="text-xs font-medium text-gray-700 hover:text-gray-900 underline"
              onClick={onClearAll}
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div className={cn(gapClassName)}>
        {filtered.map((it) => {
          const id = `chk-${it.value}`;
          const checked = selected.includes(it.value);

          return (
            <label
              key={it.value}
              htmlFor={id}
              className={cn(
                "flex items-center gap-2 select-none",
                it.disabled && "opacity-60 cursor-not-allowed"
              )}
            >
              <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={() => !it.disabled && onToggle(it.value)}
                disabled={it.disabled}
                className="shadow-none data-[state=checked]:bg-blue-main data-[state=checked]:border-blue-main data-[state=unchecked]:border-gray-300"
              />
              <span className="flex flex-col">
                <span className={labelTextClass}>{it.label}</span>
                {it.description ? (
                  <span className={descriptionClass}>{it.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-xs text-gray-500">No matches.</p>
        )}
      </div>
    </div>
  );
}
