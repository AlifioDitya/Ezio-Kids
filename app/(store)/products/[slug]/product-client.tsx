// app/products/[slug]/product-client.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useBasketStore from "@/store/store";
import useBasketUiStore from "@/store/basket-ui";
import { imageUrl } from "@/lib/imageUrl";
import { cn } from "@/lib/utils";
import type { PDPProduct } from "@/sanity/lib/productPage/getProductBySlug";
import { PortableText } from "next-sanity";
import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { isSanityImage } from "@/app/util/utils";

type Props = {
  product: PDPProduct;
  priceLabel: string;
};

export default function ProductClient({ product, priceLabel }: Props) {
  const variants = React.useMemo(
    () => product.variants ?? [],
    [product.variants]
  );

  // Distinct option lists
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

  // Quick map for pretty size label in the notice
  const sizeLabelById = React.useMemo(() => {
    const m = new Map<string, string>();
    for (const s of sizeOptions) {
      if (s?._id && s?.label) m.set(s._id, s.label);
    }
    return m;
  }, [sizeOptions]);

  // Helpers to check stock
  const colorHasAnyStock = React.useCallback(
    (colorId: string) =>
      variants.some((v) => v.color?._id === colorId && (v.stock ?? 0) > 0),
    [variants]
  );

  // Selected options
  const [selectedSizeId, setSelectedSizeId] = React.useState<string | null>(
    null
  );

  // Pick first available color by default (fallback to first)
  const [selectedColorId, setSelectedColorId] = React.useState<string | null>(
    () => {
      const firstAvailable =
        colorOptions.find((c) => (c?._id ? colorHasAnyStock(c._id) : false))
          ?._id ??
        colorOptions[0]?._id ??
        null;
      return firstAvailable;
    }
  );

  // (re-create isSizeAvailable now that selectedColorId exists)
  const _isSizeAvailable = React.useCallback(
    (sizeId: string) =>
      variants.some(
        (v) =>
          v.size?._id === sizeId &&
          (!selectedColorId || v.color?._id === selectedColorId) &&
          (v.stock ?? 0) > 0
      ),
    [variants, selectedColorId]
  );

  // Reset size if color changes
  const onSelectColor = (id: string | null) => {
    if (id !== selectedColorId && selectedSizeId) {
      setSelectedSizeId(null);
    }
    setSelectedColorId(id);
  };

  // Compute color availability (global if no size selected; otherwise for that size)
  const isColorAvailable = React.useCallback(
    (colorId: string) => colorHasAnyStock(colorId),
    [colorHasAnyStock]
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
      ? `Rp ${Math.round(activeVariant.priceOverride).toLocaleString("id-ID")}`
      : priceLabel;

  const hasSelectedSize = Boolean(selectedSizeId);
  const canAddToCart =
    !!hasSelectedSize && !!activeVariant && (activeVariant.stock ?? 0) > 0;

  const [qty, setQty] = React.useState(1);
  const isInStock = variants.some((v) => (v.stock ?? 0) > 0);

  const addItem = useBasketStore((s) => s.addItem);
  const openCart = useBasketUiStore((s) => s.open);

  const addToCart = () => {
    if (!activeVariant || !selectedSizeId) return;

    const unitPrice =
      typeof activeVariant.priceOverride === "number"
        ? activeVariant.priceOverride
        : typeof product.price === "number"
          ? product.price
          : 0;

    addItem({
      product: {
        _id: product._id,
        slug: product.slug,
        name: product.name ?? "",
        mainImage: isSanityImage(product.mainImage)
          ? product.mainImage
          : undefined,
      },
      unitPrice,
      variantKey: activeVariant._key,
      sizeId: selectedSizeId,
      colorId: activeVariant.color?._id,
      sizeLabel: sizeLabelById.get(selectedSizeId) ?? undefined,
      colorName: activeVariant.color?.name ?? undefined,
    });

    openCart();
    setQty(1);
  };

  // Low stock logic: only show after size is selected and we have a concrete variant
  const lowStockCount = activeVariant?.stock ?? 0;
  const showLowStock =
    hasSelectedSize && lowStockCount > 0 && lowStockCount < 10;

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
              const id = c?._id ?? "";
              const available = id ? isColorAvailable(id) : false;
              const checked = selectedColorId === id;
              const swatchUrl = c?.swatch
                ? imageUrl(c.swatch)
                    ?.width(80)
                    .height(80)
                    .fit("crop")
                    .auto("format")
                    .url()
                : null;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => available && onSelectColor(id)}
                  aria-pressed={checked}
                  aria-disabled={!available}
                  disabled={!available}
                  className={cn(
                    "relative h-9 w-9 rounded-full border overflow-hidden",
                    checked && "ring-2 ring-offset-2 ring-gray-900",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    // automatic diagonal strike when disabled
                    "disabled:after:content-[''] disabled:after:absolute disabled:after:left-[-12%] disabled:after:top-1/2 disabled:after:h-[1px] disabled:after:w-[124%] disabled:after:-rotate-45 disabled:after:bg-gray-400/70"
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
              const id = s?._id ?? "";
              const available = id ? _isSizeAvailable(id) : false;
              const selected = selectedSizeId === id;

              return (
                <Button
                  key={id}
                  type="button"
                  variant={selected ? "default" : "outline"}
                  size="sm"
                  disabled={!available}
                  onClick={() => available && setSelectedSizeId(id)}
                  className={cn(
                    "relative min-w-[3.25rem] bg-white justify-center shadow-none overflow-hidden",
                    selected && "bg-rose-600 hover:bg-rose-600 text-white",
                    !available && "opacity-60 cursor-not-allowed",
                    // automatic diagonal strike when disabled
                    "disabled:after:content-[''] disabled:after:absolute disabled:after:left-[-12%] disabled:after:top-1/2 disabled:after:h-[1px] disabled:after:w-[124%] disabled:after:-rotate-45 disabled:after:bg-gray-400/70"
                  )}
                >
                  {s?.label}
                </Button>
              );
            })}
          </div>

          {/* Low stock notice */}
          {showLowStock && (
            <div
              role="status"
              aria-live="polite"
              className="mt-3 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Only {lowStockCount} stock left
                {selectedSizeId
                  ? ` in size ${sizeLabelById.get(selectedSizeId) ?? "this size"}`
                  : ""}{" "}
                — grab it before it&apos;s gone!
              </span>
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Qty + ATC */}
      <div className="flex items-center gap-3">
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
                ? "bg-rose-500 hover:bg-rose-600"
                : "bg-rose-300 cursor-not-allowed"
          )}
          onClick={addToCart}
          disabled={!canAddToCart || !isInStock}
        >
          {!isInStock
            ? "Sorry, we're out of stock 😔"
            : hasSelectedSize
              ? "Add to Cart"
              : "Please Select an Available Size and Color"}
        </Button>
      </div>

      {/* Description */}
      {product.description && (
        <>
          <Separator />
          <div className="prose text-sm text-gray-700">
            <PortableText value={product.description} />
          </div>
        </>
      )}

      {/* Care instructions */}
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
