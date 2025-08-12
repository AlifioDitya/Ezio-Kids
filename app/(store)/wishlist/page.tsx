"use client";

import { useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import useWishlistStore, { WishlistItem } from "@/store/wishlist";
import type { Product } from "@/sanity.types";
import { imageUrl } from "@/lib/imageUrl";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// NEW: PDP-style floaty heart
import WishlistFloaty from "@/components/wishlist/WishlistFloaty";
import { HeartOff } from "lucide-react";

const PAGE_SIZE = 12;

function getPageList(
  current: number,
  total: number,
  windowSize = 5
): (number | "…")[] {
  if (total <= windowSize + 2)
    return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total]);
  const half = Math.floor(windowSize / 2);
  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);

  if (current <= half + 2) {
    start = 2;
    end = Math.min(total - 1, windowSize + 1);
  } else if (current >= total - (half + 1)) {
    end = total - 1;
    start = Math.max(2, total - windowSize);
  }

  for (let p = start; p <= end; p++) pages.add(p);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    result.push(p);
    const next = sorted[i + 1];
    if (next && next - p > 1) result.push("…");
  }
  return result;
}

/* ---------- Clear All dialog ---------- */
function ClearAllDialog({
  onConfirm,
  disabled,
}: {
  onConfirm: () => void;
  disabled?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={disabled} className="gap-2">
          Clear all
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear wishlist?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes all saved items. You can still find products in the
            catalog later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-700"
          >
            Clear
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ---------- Single card (PDP-style visuals) ---------- */
function WishlistCard({
  product,
  quantity,
  unitPrice,
}: {
  product: {
    _id: string;
    slug?: string;
    name?: string;
    mainImage?: Product["mainImage"];
    // we’ll surface variant chips if present
    sizeLabel?: string;
    colorName?: string;
  };
  quantity: number;
  unitPrice: number;
}) {
  const href = product.slug ? `/products/${product.slug}` : "#";
  const imgSrc = product.mainImage
    ? imageUrl(product.mainImage)?.url()
    : undefined;
  const alt = product?.mainImage?.alt || product.name || "Product Image";

  const hasVariantChips = !!(
    product.sizeLabel ||
    product.colorName ||
    quantity > 1
  );

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="h-full"
    >
      <Link href={href} className="group block overflow-hidden self-start">
        {/* image (same: relative aspect-4/5, rounded, no card bg) */}
        <div className="relative aspect-4/5 overflow-hidden rounded-sm w-full">
          {/* Heart floaty (toggles wishlist) — no bubble background */}
          <WishlistFloaty
            productId={product._id}
            slug={product.slug}
            name={product.name}
            mainImage={product.mainImage}
            unitPrice={unitPrice}
            shadow
            emptyColor="#ffffff"
          />

          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={alt}
              fill
              sizes="(min-width:1024px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gray-100 text-xs text-gray-500">
              No image
            </div>
          )}
        </div>

        {/* text block */}
        <div className="w-full h-fit flex flex-col gap-1 p-1 py-3">
          {hasVariantChips ? (
            <div className="mb-1 flex flex-wrap gap-1.5">
              {product.sizeLabel ? (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                  {product.sizeLabel}
                </span>
              ) : null}
              {product.colorName ? (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                  {product.colorName}
                </span>
              ) : null}
              {quantity > 1 ? (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                  x{quantity}
                </span>
              ) : null}
            </div>
          ) : (
            <></>
          )}

          <h2 className="mt-2 text-base font-semibold text-gray-900 truncate">
            {product.name ?? "Untitled product"}
          </h2>
          <p className="text-sm font-semibold text-gray-900">
            Rp {new Intl.NumberFormat("id-ID").format(unitPrice || 0)}
          </p>
        </div>
      </Link>
    </motion.li>
  );
}

/* ---------- Page ---------- */
export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const totalQty = useWishlistStore((s) => s.totalItems());

  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const pageParam = sp.get("page");
  const page = useMemo(() => {
    const n = Number(pageParam);
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
  }, [pageParam]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== clampedPage) {
      const next = new URLSearchParams(sp.toString());
      next.set("page", String(clampedPage));
      router.replace(`${pathname}?${next.toString()}`);
    }
  }, [page, clampedPage, pathname, router, sp]);

  const start = (clampedPage - 1) * PAGE_SIZE;
  const pageItems = items.slice(start, start + PAGE_SIZE);

  const buildPageHref = (p: number) => {
    const next = new URLSearchParams(sp.toString());
    next.set("page", String(p));
    return `${pathname}?${next.toString()}`;
  };

  // JSON-LD of visible list
  const itemListLd =
    pageItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: pageItems.map((it, idx) => {
            const url = it.product.slug
              ? `/products/${it.product.slug}`
              : "/wishlist";
            const img = it.product.mainImage
              ? imageUrl(it.product.mainImage)?.url()
              : undefined;
            return {
              "@type": "ListItem",
              position: start + idx + 1,
              url,
              name: it.product.name || "Product",
              image: img,
            };
          }),
        }
      : null;

  /* ---------- Empty state ---------- */
  if (!items.length) {
    return (
      <main className="px-4 py-12 sm:px-6 lg:px-8" aria-label="Wishlist">
        <section
          className="mx-auto max-w-3xl rounded-xl border border-dashed bg-white p-10 text-center"
          aria-labelledby="wishlist-empty-title"
        >
          <div className="relative mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gray-100 shadow-sm">
            <HeartOff className="h-7 w-7 text-rose-500" aria-hidden="true" />
          </div>
          <h1
            id="wishlist-empty-title"
            className="text-xl font-semibold text-gray-900"
          >
            Your wishlist is empty
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Save items you love and find them here later.
          </p>
          <nav
            className="mt-6 flex items-center justify-center gap-3"
            aria-label="Empty wishlist actions"
          >
            <Link href="/collections/shop-all">
              <Button className="bg-rose-500 hover:bg-rose-600">
                Browse products
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to home</Button>
            </Link>
          </nav>
        </section>
      </main>
    );
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 bg-white" aria-label="Wishlist">
      {/* JSON-LD */}
      {itemListLd ? (
        <Script
          id="ld-itemlist"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      ) : null}

      {/* Header (PDP-like type scale) */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Wishlist</h1>
          <p className="mt-0.5 text-sm text-gray-600">
            {items.length} {items.length === 1 ? "item" : "items"} • {totalQty}{" "}
            saved in total
          </p>
        </div>
        <nav className="flex items-center gap-2" aria-label="Wishlist actions">
          <Link href="/collections/shop-all">
            <Button variant="outline">Continue shopping</Button>
          </Link>
          <ClearAllDialog onConfirm={clearWishlist} disabled={!items.length} />
        </nav>
      </header>

      {/* Grid (PDP card style) */}
      <section aria-label="Saved products">
        <motion.ul
          layout
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl"
          role="list"
        >
          <AnimatePresence initial={false}>
            {pageItems.map((it: WishlistItem) => {
              const {
                product,
                quantity,
                unitPrice,
                sizeLabel,
                colorName,
                variantKey,
              } = it;
              return (
                <WishlistCard
                  key={`${product._id}-${variantKey ?? "base"}`}
                  product={{
                    _id: product._id,
                    slug: product.slug,
                    name: product.name,
                    mainImage: product.mainImage,
                    sizeLabel,
                    colorName,
                  }}
                  quantity={quantity}
                  unitPrice={unitPrice}
                />
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-8" aria-label="Wishlist pagination">
          <Pagination>
            <PaginationContent className="flex flex-wrap gap-1.5">
              <PaginationItem>
                <PaginationPrevious
                  href={
                    clampedPage > 1 ? buildPageHref(clampedPage - 1) : undefined
                  }
                  aria-disabled={clampedPage <= 1}
                />
              </PaginationItem>

              {getPageList(clampedPage, totalPages).map((it, idx) =>
                it === "…" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={it}>
                    <PaginationLink
                      href={buildPageHref(it)}
                      isActive={it === clampedPage}
                      aria-current={it === clampedPage ? "page" : undefined}
                      className="shadow-none"
                    >
                      {it}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href={
                    clampedPage < totalPages
                      ? buildPageHref(clampedPage + 1)
                      : undefined
                  }
                  aria-disabled={clampedPage >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </nav>
      )}
    </main>
  );
}
