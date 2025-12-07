"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";

type Props = {
  color: string;
  isActive: boolean;
  onEnter: (color: string) => void;
  onLeave: () => void;
  swatchUrl?: string; // Optional direct swatch image URL
  className?: string; // Allow implementing custom class
};

export default function ColorSwatch({
  color,
  isActive,
  onEnter,
  onLeave,
  swatchUrl,
  className,
}: Props) {
  // We can try to map some standard colors to CSS/Tw colors if no image is available
  // Simple mapping for demo purposes
  const getColorBg = React.useCallback((c: string) => {
    const map: Record<string, string> = {
      white: "bg-white border-gray-200",
      black: "bg-black",
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-400",
      pink: "bg-pink-400",
      gray: "bg-gray-500",
      navy: "bg-blue-900",
      beige: "bg-[#F5F5DC] border-gray-200",
      brown: "bg-[#964B00]",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
    };
    return map[c.toLowerCase()] ?? "bg-gray-200";
  }, []);

  return (
    <button
      type="button"
      className={cn(
        "relative h-5 w-5 rounded-full border border-gray-100 flex items-center justify-center transition-all",
        isActive ? "ring-1 ring-offset-1 ring-gray-900" : "hover:scale-110",
        className
      )}
      onMouseEnter={() => onEnter(color)}
      onMouseLeave={onLeave}
      onClick={() => onEnter(color)} // For mobile tap
      role="option"
      aria-label={`Select ${color}`}
      aria-selected={isActive}
    >
      {swatchUrl ? (
        <div className="relative h-full w-full rounded-full overflow-hidden">
          <Image
            src={swatchUrl}
            alt={color}
            fill
            className="object-cover"
            sizes="20px"
          />
        </div>
      ) : (
        <span
          className={cn(
            "h-full w-full rounded-full border box-border",
            getColorBg(color)
          )}
        />
      )}
    </button>
  );
}
