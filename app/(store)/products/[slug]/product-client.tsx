// app/products/[slug]/product-client.tsx
"use client";

import SwipeImageStage from "@/components/common/SwipeImageStage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { imageUrl } from "@/lib/imageUrl";
import { cn } from "@/lib/utils";
import type { PDPProduct } from "@/sanity/lib/productPage/getProductBySlug";
import { PortableText } from "next-sanity";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { FaWhatsapp } from "react-icons/fa";

type Props = {
  product: PDPProduct;
};

export default function ProductClient({ product }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Initialize State from URL or Defaults
  // ----------------------------------------
  const variants = React.useMemo(
    () => product.variants ?? [],
    [product.variants]
  );

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

  const isColorPresent = React.useCallback(
    (colorId: string) => variants.some((v) => v.color?._id === colorId),
    [variants]
  );

  // Helper to find color ID by name or slug (for URL matching)
  const findColorId = React.useCallback(
    (val: string | null) => {
      if (!val) return null;
      const lower = val.toLowerCase();
      return (
        colorOptions.find(
          (c) =>
            c?.slug === lower ||
            c?.name?.toLowerCase() === lower ||
            c?._id === val
        )?._id ?? null
      );
    },
    [colorOptions]
  );

  const findSizeId = React.useCallback(
    (val: string | null) => {
      if (!val) return null;
      const lower = val.toLowerCase();
      return (
        sizeOptions.find(
          (s) => s?.label?.toLowerCase() === lower || s?._id === val
        )?._id ?? null
      );
    },
    [sizeOptions]
  );

  // State Initialization
  // --------------------
  const initialColorId = React.useMemo(() => {
    const paramColor = searchParams.get("color");
    if (paramColor) {
      const found = findColorId(paramColor);
      if (found) return found;
    }
    // Fallback: First available or first option
    return (
      colorOptions.find((c) => (c?._id ? isColorPresent(c._id) : false))?._id ??
      colorOptions[0]?._id ??
      null
    );
  }, [searchParams, colorOptions, isColorPresent, findColorId]);

  const [selectedColorId, setSelectedColorId] = React.useState<string | null>(
    initialColorId
  );

  const getFirstAvailableSize = React.useCallback(
    (colorId: string | null) => {
      if (!colorId) return null;
      for (const size of sizeOptions) {
        if (!size?._id) continue;
        const sId = size._id;
        const v = variants.find(
          (v) => v.color?._id === colorId && v.size?._id === sId
        );
        if (v) return sId;
      }
      return null;
    },
    [sizeOptions, variants]
  );

  const [selectedSizeId, setSelectedSizeId] = React.useState<string | null>(
    () => {
      const paramSize = searchParams.get("size");
      const fromUrl = findSizeId(paramSize);
      if (fromUrl) {
        // Evaluate availability? If available for initialColorId, take it.
        // If not, maybe fallback?
        // User request: "auto select first available size"
        // Strict interpretation: if URL param exists but OOS, should we switch?
        // Let's stick to URL if explicit, otherwise fallback.
        const isAvailable = variants.some(
          (v) => v.size?._id === fromUrl && v.color?._id === initialColorId
        );
        if (isAvailable) return fromUrl;
      }
      return getFirstAvailableSize(initialColorId);
    }
  );

  // 2. State Sync with URL
  // ----------------------
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const colorObj = colorOptions.find((c) => c?._id === selectedColorId);
    const sizeObj = sizeOptions.find((s) => s?._id === selectedSizeId);

    let changed = false;

    if (colorObj?.slug) {
      if (params.get("color") !== colorObj.slug) {
        params.set("color", colorObj.slug);
        changed = true;
      }
    } else if (params.has("color") && !selectedColorId) {
      params.delete("color");
      changed = true;
    }

    if (sizeObj?.label) {
      if (params.get("size") !== sizeObj.label) {
        params.set("size", sizeObj.label);
        changed = true;
      }
    } else if (params.has("size") && !selectedSizeId) {
      params.delete("size");
      changed = true;
    }

    if (changed) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [
    selectedColorId,
    selectedSizeId,
    colorOptions,
    sizeOptions,
    router,
    searchParams,
  ]);

  // 3. Selection Logic
  // ------------------
  const _isSizeAvailable = React.useCallback(
    (sizeId: string) =>
      variants.some(
        (v) =>
          v.size?._id === sizeId &&
          (!selectedColorId || v.color?._id === selectedColorId)
      ),
    [variants, selectedColorId]
  );

  const onSelectColor = (id: string | null) => {
    if (id !== selectedColorId) {
      // Auto-select first available size for the new color
      const newSizeId = getFirstAvailableSize(id);
      setSelectedSizeId(newSizeId);
    }
    setSelectedColorId(id);
  };

  const isColorAvailable = React.useCallback(
    (colorId: string) => isColorPresent(colorId),
    [isColorPresent]
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

  // 4. Image Filtering Logic (Same as ProductCard)
  // ----------------------------------------------
  const imagesByColor = React.useMemo(() => {
    const map = new Map<string, string[]>();

    const allImages = [
      product.mainImage,
      ...(product.additionalImages ?? []),
    ].filter((img): img is NonNullable<typeof product.mainImage> => !!img);

    allImages.forEach((img) => {
      // We need URL. In PDP `product`, these are SanityImage objects.
      // We need to resolve them to URLs.
      const url = imageUrl(img)?.url();
      if (!url) return;

      const alt = img.alt || "";
      const parts = alt.split("-").map((s) => s.trim());
      if (parts.length >= 2) {
        const colorName = parts[parts.length - 1]; // "Light Green"
        const key = colorName.toLowerCase();
        if (!map.has(key)) map.set(key, []);
        map.get(key)?.push(url);
      } else {
        if (!map.has("default")) map.set("default", []);
        map.get("default")?.push(url);
      }
    });
    return map;
  }, [product]);

  const filteredImageUrls = React.useMemo(() => {
    // Current selected color name
    const activeColorObj = colorOptions.find((c) => c?._id === selectedColorId);
    const activeColorName = activeColorObj?.name?.toLowerCase();

    if (activeColorName && imagesByColor.has(activeColorName)) {
      return imagesByColor.get(activeColorName)!;
    }

    // Fallback logic
    if (colorOptions.length === 0) {
      return Array.from(imagesByColor.values()).flat();
    }

    return (
      imagesByColor.get("default") ||
      (product.mainImage ? [imageUrl(product.mainImage)?.url() ?? ""] : [])
    ).filter(Boolean);
  }, [imagesByColor, selectedColorId, colorOptions, product.mainImage]);

  // If no images found (e.g. strict filtering returned empty), show at least main image
  const finalImages =
    filteredImageUrls.length > 0
      ? filteredImageUrls
      : product.mainImage
        ? [imageUrl(product.mainImage)?.url() ?? ""]
        : [];

  // 5. Render
  // ---------
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT: Gallery */}
      <section aria-label="Product images" className="grid gap-4">
        {/* Mobile / Tablet: SwipeImageStage */}
        <div className="lg:hidden relative aspect-[3/4] w-full bg-[#F2F2F2] rounded-lg overflow-hidden">
          {finalImages.length > 0 ? (
            <SwipeImageStage
              images={finalImages} // Strings
              alt={product.name ?? "Product Image"}
              aspectClass="aspect-[3/4]"
              showPager
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              No image available
            </div>
          )}
        </div>

        {/* Desktop: 2-column image grid */}
        <div className="hidden lg:grid grid-cols-2 gap-4">
          {finalImages.map((url, idx) => (
            <div
              key={url + idx}
              className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-gray-50"
            >
              <Image
                src={url}
                alt={product.name ?? "Product image"}
                fill
                className="object-cover"
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ))}
          {finalImages.length === 0 && (
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
              No image available
            </div>
          )}
        </div>
      </section>

      {/* RIGHT: Details */}
      <section aria-label="Product details" className="space-y-4">
        <div className="flex flex-col gap-2 sticky bottom-0 z-40 md:relative">
          {/* Tags */}
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
          <div className="flex items-center gap-2 w-full justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              {product.name}
            </h1>
          </div>

          {/* Description */}
          <p className="mb-2">
            {product.category?.name} design with {product.fabric?.name}
          </p>
        </div>

        {/* Colors */}
        {colorOptions.length > 0 && (
          <div className="mb-6">
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
                    className={cn(
                      "relative h-6 w-6 rounded-full border overflow-hidden",
                      checked && "ring-2 ring-offset-2 ring-gray-900"
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
                    onClick={() => setSelectedSizeId(id)}
                    className={cn(
                      "relative min-w-[3.25rem] bg-white justify-center shadow-none overflow-hidden border border-gray-200 text-gray-800 hover:border-blue-main hover:text-blue-main",
                      selected &&
                        "border-blue-main text-blue-main hover:border-blue-main hover:text-blue-main hover:bg-blue-main/5",
                      !available && "opacity-60"
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

        {/* Contact Us CTA */}
        {/* WhatsApp CTA */}
        {(() => {
          const isNotAvailable = !activeVariant;

          if (isNotAvailable) {
            return (
              <Button
                disabled
                className="w-full h-11 text-base font-semibold bg-gray-200 text-gray-500 cursor-not-allowed"
              >
                Product not available in this variant
              </Button>
            );
          }

          const colorName =
            colorOptions.find((c) => c?._id === selectedColorId)?.name ||
            "Default Color";
          const sizeLabel =
            sizeOptions.find((s) => s?._id === selectedSizeId)?.label ||
            "Default Size";

          const message = `Halo, Saya tertarik dengan produk ${product.name}, warna ${colorName} ukuran ${sizeLabel}`;
          const whatsappUrl = `https://wa.me/6281310899214?text=${encodeURIComponent(
            message
          )}`;

          return (
            <div className="flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full h-11 text-white text-base font-semibold bg-green-500 hover:bg-green-600 gap-2">
                  <FaWhatsapp className="w-5 h-5" />
                  Contact us about this product
                </Button>
              </a>
            </div>
          );
        })()}

        {/* Description */}
        {product.description && (
          <>
            <Separator />
            <div className="prose text-sm text-gray-700">
              <PortableText value={product.description} />
            </div>
          </>
        )}

        {/* Product Details Accordion */}
        <div className="pt-4">
          <Accordion type="single" collapsible className="w-full">
            {/* Fabric */}
            {product.fabric && (
              <AccordionItem value="fabric">
                <AccordionTrigger>Fabric</AccordionTrigger>
                <AccordionContent>
                  <div className="flex gap-4 pb-4">
                    {product.fabric.image && (
                      <div className="relative w-full max-w-1/2 md:max-w-1/3 rounded-md overflow-hidden bg-gray-100 aspect-square">
                        <Image
                          src={imageUrl(product.fabric.image)?.url() ?? ""}
                          alt={product.fabric.name ?? "Fabric image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-2 max-w-2/3">
                      {product.fabric.name && (
                        <h4 className="font-medium text-sm">
                          {product.fabric.name}
                        </h4>
                      )}
                      {product.fabric.description && (
                        <p className="text-gray-600">
                          {product.fabric.description}
                        </p>
                      )}
                      {product.fabric.weight && (
                        <p className="text-sm mt-4">
                          <span className="font-medium">Weight:</span>{" "}
                          {product.fabric.weight}gsm
                        </p>
                      )}
                      {product.fabric.properties &&
                        product.fabric.properties.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {product.fabric.properties.map((prop, idx) => (
                              <div
                                key={idx}
                                className="bg-gray-50 p-2 rounded text-sm"
                              >
                                <span className="font-medium text-gray-900">
                                  {prop.key}:
                                </span>{" "}
                                <span className="text-gray-600">
                                  {prop.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Collar Type */}
            {product.collarType && (
              <AccordionItem value="collarType">
                <AccordionTrigger>Collar Type</AccordionTrigger>
                <AccordionContent>
                  <div className="flex gap-4 pb-4">
                    {product.collarType.image && (
                      <div className="relative w-full max-w-1/2 md:max-w-1/3 rounded-md overflow-hidden bg-gray-100 aspect-square">
                        <Image
                          src={imageUrl(product.collarType.image)?.url() ?? ""}
                          alt={product.collarType.name ?? "Collar Type image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-2 max-w-2/3">
                      {product.collarType.name && (
                        <h4 className="font-medium text-sm">
                          {product.collarType.name}
                        </h4>
                      )}
                      {product.collarType.description && (
                        <p className="text-gray-600">
                          {product.collarType.description}
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <AccordionItem value="features">
                <AccordionTrigger>Product Features</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4">
                    {product.features.map((feature) => (
                      <li key={feature._key} className="flex gap-4">
                        {feature.image && (
                          <div className="relative shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={imageUrl(feature.image)?.url() ?? ""}
                              alt={feature.title ?? "Feature image"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-sm">
                            {feature.title}
                          </h4>
                          {feature.description && (
                            <p className="text-sm text-gray-600 mt-0.5">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Composition */}
            {product.composition && product.composition.length > 0 && (
              <AccordionItem value="composition">
                <AccordionTrigger>Composition</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {product.composition.map((comp) => (
                      <li
                        key={comp._key}
                        className="flex gap-2 text-sm py-1 border-b border-gray-100 last:border-0"
                      >
                        <span className="font-medium text-gray-700">
                          {comp.material}
                        </span>
                        <span className="text-gray-500">
                          {comp.percentage}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Care Instructions */}
            {Array.isArray(product.careInstructions) &&
              product.careInstructions.length > 0 && (
                <AccordionItem value="care">
                  <AccordionTrigger>Care Instructions</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm text-gray-700 max-w-none">
                      <PortableText
                        value={product.careInstructions}
                        components={{
                          list: {
                            bullet: ({ children }) => (
                              <ul className="list-disc pl-5 space-y-1">
                                {children}
                              </ul>
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
                  </AccordionContent>
                </AccordionItem>
              )}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
