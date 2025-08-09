// app/collections/shop-all/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-4/5 w-full rounded-sm" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

export default function LoadingShopAll() {
  return (
    <main className="overflow-x-hidden bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-row gap-8 py-6">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-64 space-y-4">
          <Skeleton className="h-7 w-44" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>
        </aside>

        {/* Grid skeleton */}
        <section className="flex-1">
          <Skeleton className="h-9 w-64 mb-6" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
