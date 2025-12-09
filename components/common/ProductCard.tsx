// components/common/ProductCard.tsx
"use client";

import ColorSwatch from "@/components/common/ColorSwatch";
import SwipeImageStage from "@/components/common/SwipeImageStage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import NextImage from "next/image";
import Link from "next/link";
import * as React from "react";

// Types corresponding to our modified Sanity query in getProducts.tsx
// Types corresponding to our modified Sanity query in getProducts.tsx
// SanityImage type removed as unused

type Variant = {
  _key: string;
  color?: {
    name?: string;
    slug?: string;
    trueColor?: string;
    swatchUrl?: string;
  };
  size?: { label?: string; order?: number };
  stock?: number;
  priceOverride?: number;
};

// Flattened Product type for props
export type ProductCardProps = {
  product: {
    _id: string;
    slug?: { current: string | null };
    name: string | null;
    price: number | null;
    mainImageUrl?: string;
    // We expect mainImage and additionalImages to have alt text for parsing
    mainImage?: { asset?: { url: string }; alt?: string };
    additionalImages?: Array<{ asset?: { url: string }; alt?: string }>;
    variants?: Variant[] | null;
    tagInfo?: Array<{ title?: string; slug?: string }>;
    category?: { name?: string; slug?: string };
    fabric?: { name?: string };
    arrivalDate?: string | null;
    _createdAt?: string;
    _updatedAt?: string;
  };
  maxImagesPerColor?: number;
  maxColorSwatches?: number;
  cardClassName?: string;
  staticMode?: boolean; // if true, disable swipe functionality on images
  showPager?: boolean; // if true, show pager on image stage
  variant?: "default" | "expanded";
  onProductClick?: () => void;
};

const isNew = (iso?: string, days = 21) =>
  iso ? Date.now() - new Date(iso).getTime() < days * 864e5 : false;

export default function ProductCard({
  product,
  maxImagesPerColor = 4,
  maxColorSwatches = 3,
  cardClassName,
  staticMode = false,
  showPager = false,
  variant = "default",
  onProductClick,
}: ProductCardProps) {
  // 1. Extract Colors from Variants
  const colors = React.useMemo(() => {
    if (!product.variants) return [];

    // Unique colors by slug
    const unique = new Map<string, Variant["color"]>();
    product.variants.forEach((v) => {
      if (v.color?.slug) {
        unique.set(v.color.slug, v.color);
      }
    });
    return Array.from(unique.values());
  }, [product.variants]);

  // 2. Parse Images and Group by Color
  // Alt format: "<Photo Type> - <Color Name>" -> e.g. "Front - Light Green"
  // We match <Color Name> with variant color names.
  const imagesByColor = React.useMemo(() => {
    const map = new Map<string, string[]>();

    // Combine all images
    const allImages = [
      ...(product.mainImage ? [product.mainImage] : []),
      ...(product.additionalImages ?? []),
    ];

    allImages.forEach((img) => {
      const url = img.asset?.url;
      if (!url) return;

      const alt = img.alt || "";
      // Try parsing "Type - Color"
      const parts = alt.split("-").map((s) => s.trim());
      if (parts.length >= 2) {
        // Assume last part is Color Name
        // Note: This relies on Color Name matching EXACTLY with variant color name
        // or we might need to be looser (lowercase match).
        const colorName = parts[parts.length - 1]; // "Light Green"

        // We store by lower case name for safer matching
        const key = colorName.toLowerCase();
        if (!map.has(key)) map.set(key, []);
        map.get(key)?.push(url);
      } else {
        // Fallback: Add to "undefined" or "default" bucket
        if (!map.has("default")) map.set("default", []);
        map.get("default")?.push(url);
      }
    });
    return map;
  }, [product.mainImage, product.additionalImages]);

  // 3. Determine Default and Active Color
  const defaultColor = React.useMemo(() => colors[0], [colors]);
  const [activeColor, setActiveColor] = React.useState<string | null>(
    defaultColor?.slug ?? null
  );

  // Update active color if product changes
  React.useEffect(
    () => setActiveColor(defaultColor?.slug ?? null),
    [product._id, defaultColor]
  );

  // Helper to find images for current active color
  const imageUrls = React.useMemo(() => {
    // Find color name for active slug
    const activeColorObj = colors.find((c) => c?.slug === activeColor);
    const activeColorName = activeColorObj?.name?.toLowerCase();

    // 1. Try specific color match
    if (activeColorName && imagesByColor.has(activeColorName)) {
      return imagesByColor.get(activeColorName)!.slice(0, maxImagesPerColor);
    }

    // 2. If no specific match, maybe fallback to "default" (unlabeled) images
    // OR if we have NO colors defined, show all images.
    if (colors.length === 0) {
      // Return all found images in order
      const all = Array.from(imagesByColor.values()).flat();
      return all.slice(0, maxImagesPerColor);
    }

    // 3. Last fallback: default bucket
    return (
      imagesByColor.get("default")?.slice(0, maxImagesPerColor) ||
      // If really nothing, use main image only as safety
      (product.mainImageUrl ? [product.mainImageUrl] : [])
    );
  }, [
    colors,
    activeColor,
    imagesByColor,
    maxImagesPerColor,
    product.mainImageUrl,
  ]);

  // Links
  const hrefBase = `/products/${product.slug?.current}`;
  const hrefWithParams = React.useMemo(() => {
    if (!activeColor) return hrefBase;
    const q = new URLSearchParams({ color: activeColor }).toString();
    return `${hrefBase}?${q}`;
  }, [hrefBase, activeColor]);

  const cardClass = `
    shrink-0 snap-start border-0 bg-transparent p-0 shadow-none gap-4
    ${variant === "expanded" ? "flex flex-col" : ""}
    ${cardClassName ?? ""}
  `;

  return (
    <Card data-card="true" className={cardClass}>
      {/* IMAGE links to PDP with ?color=<selected> */}
      <Link
        href={hrefWithParams}
        prefetch
        className="block"
        onClick={onProductClick}
      >
        <CardContent className="p-0">
          {variant === "expanded" ? (
            // EXPANDED VARIANT (Grid of 3 images)
            <div className="flex flex-col gap-4 mt-6 mb-4 lg:mt-12 lg:mb-10">
              <div className="grid grid-cols-3 gap-0.5">
                {imageUrls.slice(0, 3).map((url) => (
                  <div
                    key={url}
                    className="relative aspect-[9/16] lg:aspect-[3/4] w-full overflow-hidden"
                  >
                    <NextImage
                      src={url}
                      alt={product.name ?? "Product"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-end px-3 lg:px-6">
                <div>
                  <h3 className="text-sm text-black tracking-wide">
                    {product.name}
                  </h3>
                  <div className="mt-1 flex flex-col items-start">
                    <p className="text-xs text-gray-800 tracking-wide">
                      {product.category?.name
                        ? `${product.category.name} design`
                        : ""}{" "}
                      {product.fabric?.name
                        ? `with ${product.fabric.name}`
                        : ""}
                    </p>
                  </div>
                </div>

                {/* Color Selection */}
                {colors.length > 1 && (
                  <div
                    className="flex items-center gap-2 mr-0.5 mb-1"
                    role="listbox"
                    aria-label="Available colors"
                  >
                    {colors.slice(0, maxColorSwatches).map((c) => (
                      <ColorSwatch
                        key={c!.slug!}
                        color={c!.name ?? "color"}
                        isActive={c!.slug === activeColor}
                        onEnter={() => setActiveColor(c!.slug!)}
                        onLeave={() => {}}
                        swatchUrl={c!.swatchUrl}
                      />
                    ))}
                    {colors.length > maxColorSwatches && (
                      <span className="mb-0.5 text-xs text-gray-900">
                        + {colors.length - maxColorSwatches}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // DEFAULT VARIANT (Single Swipeable Image)
            <div className="relative overflow-hidden bg-[#F2F2F2] aspect-[3/4] rounded">
              <SwipeImageStage
                key={`${activeColor || "none"}|${imageUrls.join(",")}`}
                showPager={showPager}
                images={imageUrls}
                alt={product.name ?? "Product"}
                staticMode={staticMode}
              />
              {isNew(product._createdAt) && (
                <Badge className="absolute right-3 bottom-3 rounded-md font-normal bg-white/80 text-gray-900 backdrop-blur-sm border-0 hover:bg-white/90">
                  New
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Link>

      {variant !== "expanded" && (
        <div>
          {/* TITLE links to PDP with ?color=<selected> */}
          <Link
            href={hrefWithParams}
            prefetch
            className="block"
            onClick={onProductClick}
          >
            <h3 className="line-clamp-1 text-sm max-w-[90%] text-black font-semibold">
              {product.name}
            </h3>
          </Link>

          <div className="flex flex-col gap-4">
            <div className="mt-1.5 flex flex-col items-start">
              <p className="text-xs text-gray-800 tracking-wide">
                {product.category?.name
                  ? `${product.category.name} design`
                  : ""}{" "}
                {product.fabric?.name ? `with ${product.fabric.name}` : ""}
              </p>
            </div>

            {colors.length > 0 && (
              <div
                className="flex items-center gap-2 mt-0"
                role="listbox"
                aria-label="Available colors"
              >
                {colors.length > 1 ? (
                  <>
                    {colors.slice(0, maxColorSwatches).map((c) => (
                      <ColorSwatch
                        key={c!.slug!}
                        color={c!.name ?? "color"}
                        isActive={c!.slug === activeColor}
                        onEnter={() => setActiveColor(c!.slug!)}
                        onLeave={() => {}}
                        swatchUrl={c!.swatchUrl}
                        className="w-4 h-4"
                      />
                    ))}
                    {colors.length > maxColorSwatches && (
                      <span className="text-xs text-gray-900">
                        + {colors.length - maxColorSwatches}
                      </span>
                    )}
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
