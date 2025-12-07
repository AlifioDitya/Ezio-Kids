"use client";
import { cn } from "@/lib/utils";

type Props = {
  count: number;
  index: number;
  onSelect: (index: number) => void;
  className?: string;
  trackClassName?: string;
  activeClassName?: string;
  height?: number;
  ariaLabel?: string;
};

export default function SegmentedSliderPager({
  count,
  index,
  onSelect,
  className,
  trackClassName = "bg-gray-200",
  activeClassName = "bg-black",
  height = 2,
  ariaLabel = "Slider pager",
}: Props) {
  return (
    <div
      className={cn("flex w-full gap-1 p-4", className)}
      role="tablist"
      aria-label={ariaLabel}
    >
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(i);
          }}
          className={cn(
            "flex-1 transition-colors duration-300 rounded-full",
            i === index ? activeClassName : trackClassName
          )}
          style={{ height }}
          role="tab"
          aria-selected={i === index}
          aria-label={`Slide ${i + 1}`}
        />
      ))}
    </div>
  );
}
