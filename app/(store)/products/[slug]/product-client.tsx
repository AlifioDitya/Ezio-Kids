// app/products/[slug]/product-client.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { imageUrl } from "@/lib/imageUrl";
import { cn } from "@/lib/utils";
import type { PDPProduct } from "@/sanity/lib/productPage/getProductBySlug";
import { PortableText } from "next-sanity";
import * as React from "react";

type Props = {
  product: PDPProduct;
  priceLabel: string;
};

export default function ProductClient({ product, priceLabel }: Props) {
  const variants = React.useMemo(
    () => product.variants ?? [],
    [product.variants]
  );

  // Build distinct option lists from variants
  const colorOptions = React.useMemo(() => {
    const map = new Map<
      string,
      NonNullable<PDPProduct["variants"]>[number]["color"]
    >();
    for (const v of variants) {
      const c = v.color;
      if (c && !map.has(c._id)) map.set(c._id, c);
    }
    return Array.from(map.values());
  }, [variants]);

  const sizeOptions = React.useMemo(() => {
    const map = new Map<
      string,
      NonNullable<PDPProduct["variants"]>[number]["size"]
    >();
    for (const v of variants) {
      const s = v.size;
      if (s && !map.has(s._id)) map.set(s._id, s);
    }
    return Array.from(map.values()).sort(
      (a, b) => (a?.order ?? 0) - (b?.order ?? 0)
    );
  }, [variants]);

  // Selected options
  const [selectedColorId, setSelectedColorId] = React.useState<string | null>(
    () => colorOptions[0]?._id ?? null
  );
  const [selectedSizeId, setSelectedSizeId] = React.useState<string | null>(
    null
  );
  const [qty, setQty] = React.useState(1);

  const isSizeAvailable = (sizeId: string) =>
    variants.some(
      (v) =>
        v.size?._id === sizeId &&
        (!selectedColorId || v.color?._id === selectedColorId) &&
        (v.stock ?? 0) > 0
    );

  const activeVariant = React.useMemo(() => {
    return (
      variants.find(
        (v) =>
          (!selectedColorId || v.color?._id === selectedColorId) &&
          (!selectedSizeId || v.size?._id === selectedSizeId)
      ) ?? null
    );
  }, [variants, selectedColorId, selectedSizeId]);

  const displayPrice =
    activeVariant?.priceOverride != null
      ? `IDR ${Math.round(activeVariant.priceOverride).toLocaleString("id-ID")}`
      : priceLabel;

  const hasSelectedSize = Boolean(selectedSizeId);
  const canAddToCart =
    !!hasSelectedSize && !!activeVariant && (activeVariant.stock ?? 0) > 0;

  const addToCart = () => {
    if (!activeVariant || !selectedSizeId) return;
    // TODO: wire to your cart
    console.log("Add", {
      productId: product._id,
      variantKey: activeVariant._key,
      qty,
    });
  };

  const isInStock = variants.some((v) => (v.stock ?? 0) > 0);

  return (
    <div className="space-y-4">
      {/* Tags */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {product.tags?.map((tag) => (
            <Badge
              key={tag._id}
              className="text-xs font-medium"
              variant="outline"
            >
              {tag.title}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          {product.name}
        </h1>

        {/* Price */}
        <p className="text-base font-semibold text-gray-900">{displayPrice}</p>
      </div>

      {/* Colors */}
      {colorOptions.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-800">Color</p>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((c) => {
              const swatchUrl = c?.swatch
                ? imageUrl(c.swatch)
                    ?.width(80)
                    .height(80)
                    .fit("crop")
                    .auto("format")
                    .url()
                : null;
              const checked = selectedColorId === c?._id;
              return (
                <button
                  key={c?._id}
                  type="button"
                  onClick={() => setSelectedColorId(c?._id ?? null)}
                  aria-pressed={checked}
                  className={cn(
                    "relative h-9 w-9 rounded-full border",
                    checked ? "ring-2 ring-offset-2 ring-gray-900" : "ring-0"
                  )}
                  title={c?.name ?? ""}
                >
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: swatchUrl
                        ? `url(${swatchUrl}) center/cover no-repeat`
                        : "#e5e7eb",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Separator />

      {/* Sizes */}
      {sizeOptions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Size</p>
            <button className="text-sm underline text-gray-600">
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((s) => {
              const selected = selectedSizeId === s?._id;
              const available = s?._id ? isSizeAvailable(s._id) : false;
              return (
                <Button
                  key={s?._id}
                  type="button"
                  variant={selected ? "default" : "outline"}
                  size="sm"
                  disabled={!available}
                  onClick={() => setSelectedSizeId(s?._id ?? null)}
                  className={cn(
                    "min-w-[3.25rem] bg-white justify-center shadow-none cursor-pointer",
                    selected && "bg-rose-600 hover:bg-rose-600",
                    !available && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {s?.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      <Separator />

      {/* Qty + ATC */}
      <div className="flex items-center gap-3">
        {/* hide qty until size is chosen */}
        {hasSelectedSize && (
          <div className="inline-flex items-center border rounded-md">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </Button>
            <span className="w-10 text-center">{qty}</span>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setQty((q) => q + 1)}
            >
              +
            </Button>
          </div>
        )}

        <Button
          className={cn(
            "flex-1 h-11 text-white text-base font-semibold",
            !isInStock
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : canAddToCart
                ? "bg-rose-500 hover:bg-rose-600 cursor-pointer"
                : "bg-rose-300 cursor-not-allowed"
          )}
          onClick={addToCart}
          disabled={!canAddToCart || !isInStock}
        >
          {!isInStock
            ? "Sorry, we're out of stock 😔"
            : hasSelectedSize
              ? "Add to Cart"
              : "Please Select a Size"}
        </Button>
      </div>

      {/* Optional: description */}
      {product.description && (
        <>
          <Separator />
          <div className="prose text-sm text-gray-700">
            <PortableText value={product.description} />
          </div>
        </>
      )}
      {/* Optional: care instructions */}
      {Array.isArray(product.careInstructions) &&
        product.careInstructions.length > 0 && (
          <>
            <Separator />
            <div className="prose text-sm text-gray-700">
              <h3 className="font-semibold mb-3">Care Instructions</h3>

              <PortableText
                value={product.careInstructions}
                components={{
                  list: {
                    bullet: ({ children }) => (
                      <ul className="list-disc pl-5 space-y-1">{children}</ul>
                    ),
                    number: ({ children }) => (
                      <ol className="list-decimal pl-5 space-y-1">
                        {children}
                      </ol>
                    ),
                  },
                  listItem: {
                    bullet: ({ children }) => <li>{children}</li>,
                    number: ({ children }) => <li>{children}</li>,
                  },
                }}
              />
            </div>
          </>
        )}
    </div>
  );
}
