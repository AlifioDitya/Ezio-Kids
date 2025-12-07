// components/search/SearchDrawer.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Logo from "@/public/images/ezio-kids-logo.svg";
import useSearchUi from "@/store/search-ui";
import { History, Search, TrendingUp, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import ProductTile from "../common/ProductTile";

type ApiResult = {
  q: string;
  products: {
    _id: string;
    name?: string;
    price?: number;
    slug?: { current?: string };
    mainImage?: unknown;
    mainImageUrl?: string;
    tagInfo?: { title?: string; slug?: string }[];
  }[];
  suggestions: string[];
  total: number;
};

export default function SearchDrawer() {
  const { open, setOpen, addRecent, recent, clearRecent } = useSearchUi();
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [res, setRes] = React.useState<ApiResult | null>(null);
  const router = useRouter();
  const controllerRef = React.useRef<AbortController | null>(null);
  const [popular, setPopular] = React.useState<
    { title: string; slug?: string }[]
  >([]);

  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const r = await fetch("/api/popular", { cache: "no-store" });
      const j = await r.json();
      if (!cancelled) setPopular(Array.isArray(j?.tags) ? j.tags : []);
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Debounce fetch
  React.useEffect(() => {
    if (!open) return;
    if (!q.trim()) {
      setRes(null);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();
        const r = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&limit=8`,
          {
            signal: controllerRef.current.signal,
          }
        );
        const json = (await r.json()) as ApiResult;
        setRes(json);
      } catch {
        /* ignore aborts */
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(id);
  }, [q, open]);

  const closeAndReset = () => {
    setOpen(false);
    setTimeout(() => {
      setQ("");
      setRes(null);
    }, 150);
  };

  const goToAllResults = () => {
    if (!q.trim()) return;
    addRecent(q);

    const base =
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/collections/")
        ? window.location.pathname
        : "/collections/shop-all";

    const sp =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();
    sp.set("q", q.trim());
    sp.delete("page");

    router.push(`${base}?${sp.toString()}`);
    closeAndReset();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTitle className="sr-only">Search</SheetTitle>

      <SheetContent
        side="top"
        className={cn(
          "fixed inset-x-0 top-0 z-[60] w-full max-w-none border-b p-0",
          "h-[100dvh] bg-white flex flex-col"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          {/* Row 1: Logo + Close */}
          <div className="relative mx-auto max-w-4xl px-4 pt-6 pb-5">
            <div className="flex items-center justify-center">
              <Image src={Logo} alt="Ezio Kids Logo" height={28} />
            </div>

            <SheetClose asChild>
              <button
                aria-label="Close search"
                className="fixed right-4 top-4 rounded-full p-2 hover:bg-gray-100 active:scale-95"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </SheetClose>
          </div>

          {/* Row 2: Search bar + Clear */}
          <div className="mx-auto flex w-full max-w-4xl items-center gap-2 px-4 pb-3">
            <div className="relative w-full group">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, tags, categories…"
                className={cn(
                  "h-11 w-full rounded-full border border-gray-200 bg-transparent px-9 pr-20 text-[15px]",
                  "outline-none ring-0 focus:border-gray-300"
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && q.trim()) goToAllResults();
                  if (e.key === "Escape") closeAndReset();
                }}
              />

              {/* Mobile inline clear (appears inside the field) */}
              {q && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQ("");
                    setRes(null);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 md:hidden"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Desktop Clear all */}
            <button
              type="button"
              onClick={() => {
                setQ("");
                setRes(null);
              }}
              className="hidden md:inline-flex text-sm font-medium text-gray-700 hover:text-gray-900 px-2 whitespace-nowrap"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-4 py-4 pb-[max(40px,env(safe-area-inset-bottom))]">
            {/* No query -> cards */}
            {!q.trim() && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card title="Recent" icon={<History className="h-4 w-4" />}>
                  {recent.length ? (
                    <div className="flex flex-wrap gap-2">
                      {recent.map((r) => (
                        <button
                          key={r}
                          onClick={() => setQ(r)}
                          className="rounded-full border bg-white px-3 py-1 text-sm hover:bg-gray-50"
                        >
                          {r}
                        </button>
                      ))}
                      <button
                        onClick={clearRecent}
                        className="ml-1 text-xs text-gray-500 underline"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No recent searches.</p>
                  )}
                </Card>

                <Card title="Popular" icon={<TrendingUp className="h-4 w-4" />}>
                  <div className="flex flex-wrap gap-2">
                    {(popular.length
                      ? popular
                      : [
                          { title: "new-arrival" },
                          { title: "best-seller" },
                          { title: "chambray" },
                        ]
                    )
                      .slice(0, 7)
                      .map((t) => {
                        const key = t.slug ?? t.title;
                        const label = t.title ?? t.slug ?? "";
                        const queryVal = t.slug ?? t.title ?? "";
                        return (
                          <button
                            key={key}
                            onClick={() => setQ(queryVal)}
                            className="rounded-full bg-rose-50 text-rose-700 px-3 py-1 text-sm hover:bg-rose-100"
                          >
                            {label}
                          </button>
                        );
                      })}
                  </div>
                </Card>
              </div>
            )}

            {/* Loading */}
            {q.trim() && loading && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Results */}
            {q.trim() && !loading && res && (
              <div className="space-y-6">
                {res.products.length ? (
                  <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {res.products.map((p) => {
                      const href = p.slug?.current
                        ? `/products/${p.slug.current}`
                        : "#";
                      return (
                        <li key={p._id}>
                          <ProductTile
                            href={href}
                            name={p.name ?? "Untitled"}
                            price={p.price ?? null}
                            image={p.mainImage}
                            tags={p.tagInfo}
                            tagLimit={2}
                            variant="plain"
                            onClick={() => {
                              if (q.trim()) addRecent(q);
                              closeAndReset();
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="rounded-xl border-none bg-white px-6 py-10 text-center">
                    <h3 className="text-base font-semibold text-gray-900">
                      No results
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Try a different term or browse all products.
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/collections/shop-all"
                        className="inline-flex items-center justify-center rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                        onClick={closeAndReset}
                      >
                        Shop all
                      </Link>
                    </div>
                  </div>
                )}

                {res.total > res.products.length && (
                  <div className="flex items-center justify-center">
                    <Button
                      onClick={goToAllResults}
                      className="bg-rose-500 hover:bg-rose-600 text-white"
                    >
                      See all {res.total} results
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <Skeleton className="w-full aspect-[4/5]" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
