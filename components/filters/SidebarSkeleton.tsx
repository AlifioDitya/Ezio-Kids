// components/filters/SidebarSkeleton.tsx
export default function SidebarSkeleton() {
  return (
    <aside className="hidden sm:flex w-48 gap-3 flex-col">
      <div className="h-9 w-full rounded bg-gray-200 animate-pulse" />
      <div className="h-5 w-24 rounded bg-gray-200 animate-pulse mt-2" />
      <div className="flex flex-wrap gap-2 mt-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"
          />
        ))}
      </div>
      <div className="h-5 w-28 rounded bg-gray-200 animate-pulse mt-4" />
      <div className="flex flex-wrap gap-2 mt-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-8 w-12 rounded bg-gray-200 animate-pulse" />
        ))}
      </div>
    </aside>
  );
}
