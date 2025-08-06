// app/products/[slug]/page.tsx
import { imageUrl } from "@/lib/imageUrl";
import {
  getProductBySlug,
  type PDPProduct,
} from "@/sanity/lib/productPage/getProductBySlug";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductClient from "./product-client";

// shadcn carousel
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function formatIDR(n: number | null) {
  if (typeof n !== "number") return "IDR 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  type ProductImage = SanityImageSource & { alt?: string };

  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  const images: ProductImage[] = [
    product.mainImage,
    ...(product.additionalImages ?? []),
  ].filter(Boolean) as ProductImage[];

  const priceLabel = formatIDR(product.price);

  return (
    <main className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8 bg-white pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: gallery */}
        <section aria-label="Product images" className="grid gap-4">
          {/* Mobile / Tablet: Carousel */}
          <div className="lg:hidden relative">
            {images.length > 0 ? (
              <Carousel opts={{ align: "start", loop: false }}>
                <CarouselPrevious
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white shadow p-2 border-none"
                >
                  ←
                </CarouselPrevious>

                <CarouselContent className="-ml-2">
                  {images.map((img, idx) => {
                    const url =
                      imageUrl(img)
                        ?.width(1200)
                        .height(1500)
                        .fit("crop")
                        .auto("format")
                        .url() ?? "";
                    return (
                      <CarouselItem key={idx} className="pl-2 basis-full">
                        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-gray-50">
                          {url ? (
                            <Image
                              src={url}
                              alt={img?.alt ?? product.name ?? "Product image"}
                              fill
                              className="object-cover"
                              priority={idx === 0}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-500">
                              No image available
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>

                <CarouselNext
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white shadow p-2 border-none"
                >
                  →
                </CarouselNext>
              </Carousel>
            ) : (
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>

          {/* Desktop: 2-column image grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {images.length > 0 ? (
              images.map((img, idx) => {
                const url =
                  imageUrl(img)
                    ?.width(1200)
                    .height(1500)
                    .fit("crop")
                    .auto("format")
                    .url() ?? "";
                return (
                  <div
                    key={idx}
                    className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-gray-50"
                  >
                    {url ? (
                      <Image
                        src={url}
                        alt={img?.alt ?? product.name ?? "Product image"}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        No image available
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>
        </section>

        {/* RIGHT: interactive details */}
        <section aria-label="Product details">
          <ProductClient
            product={product as PDPProduct}
            priceLabel={priceLabel}
          />
        </section>
      </div>
    </main>
  );
}
