// components/common/ProductTile.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { imageUrl } from "@/lib/imageUrl";
import { ArrowRight } from "lucide-react";

type Tag = { title?: string; slug?: string } | null | undefined;

export type ProductTileProps = {
  href: string;
  name?: string | null;
  price?: number | null;
  image?: unknown; // Sanity image OR URL string
  badge?: string | null;
  tags?: Tag[]; // optional tag pills
  tagLimit?: number; // default 2
  variant?: "plain" | "accent";
  aspectClass?: string; // tailwind aspect, default "aspect-[4/5]"
  className?: string;
  onClick?: () => void;
};

function toImgUrl(src: unknown, w = 600, h = 750): string {
  if (!src) return "";
  if (typeof src === "string" && /^https?:\/\//.test(src)) return src;
  try {
    return (
      imageUrl(src)?.width(w).height(h).fit("crop").auto("format").url() || ""
    );
  } catch {
    return "";
  }
}

export default function ProductTile({
  href,
  name,
  price,
  image,
  badge,
  tags,
  tagLimit = 2,
  variant = "plain",
  aspectClass = "aspect-[4/5]",
  className,
  onClick,
}: ProductTileProps) {
  const url = toImgUrl(image);
  const priceLabel =
    typeof price === "number"
      ? `Rp ${Math.round(price).toLocaleString("id-ID")}`
      : "—";

  const wrapper =
    variant === "accent"
      ? "relative block rounded-xl"
      : "group block rounded-xl border bg-white overflow-hidden hover:shadow-md transition";

  const inner =
    variant === "accent"
      ? "rounded-2xl bg-white/85 backdrop-blur-sm overflow-hidden"
      : "";

  return (
    <Link href={href} className={cn(wrapper, className)} onClick={onClick}>
      <div className={cn(inner)}>
        <div className={cn("relative w-full bg-gray-100", aspectClass)}>
          <div className="absolute inset-0 overflow-hidden">
            {url ? (
              <Image
                src={url}
                alt={name ?? "Product"}
                fill
                sizes="(min-width:1024px) 25vw, 50vw"
                className={cn(
                  "object-cover transition-transform duration-300",
                  "group-hover:scale-[1.02]"
                )}
                priority={false}
              />
            ) : null}
          </div>

          {badge ? (
            <div className="absolute left-2.5 top-2.5 z-10 inline-flex items-center rounded-full bg-gradient-to-b from-rose-500 to-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              {badge}
            </div>
          ) : null}

          {variant === "accent" ? (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          ) : null}
        </div>

        <div className="p-4">
          <div
            className={cn(
              "font-semibold text-gray-900 truncate",
              variant === "accent" ? "text-lg line-clamp-2" : "text-sm"
            )}
          >
            {name ?? "Untitled"}
          </div>

          {variant === "accent" ? (
            <button className="flex gap-1 items-center mt-1">
              <span className="text-sm sm:text-base text-gray-700">
                Shop Now
              </span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-gray-500" />
            </button>
          ) : (
            <div className={cn("mt-1 text-gray-900", "text-sm text-gray-600")}>
              {priceLabel}
            </div>
          )}

          {!!tags?.length && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.slice(0, tagLimit).map((t, i) => (
                <span
                  key={`${t?.slug ?? t?.title ?? i}`}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700"
                >
                  {t?.title}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
