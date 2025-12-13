// app/collections/[slug]/loading.tsx
import SidebarSkeleton from "@/components/filters/SidebarSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="overflow-x-hidden bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-row gap-8 py-6 mt-14">
        <SidebarSkeleton />
        <section className="flex flex-col flex-1">
          <div className="h-8 w-64 rounded bg-gray-200 animate-pulse mb-6" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-4/5 w-full rounded-sm" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
