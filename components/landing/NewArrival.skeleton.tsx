// components/landing/NewArrival.skeleton.tsx
export default function NewArrivalSkeleton() {
  return (
    <section className="bg-indigo-50 py-8 md:py-12">
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-6 w-64 bg-gray-200 rounded mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[3/4] w-full bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
