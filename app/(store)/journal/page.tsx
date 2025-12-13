import JournalCard from "@/components/journal/JournalCard";
import { getAllJournalsQuery } from "@/sanity/lib/journal/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal - Ezio Kids",
  description:
    "Read our latest stories, style guides, and updates from Ezio Kids.",
};

interface Journal {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  image: SanityImageSource;
  excerpt?: string;
}

export default async function JournalPage() {
  const { data: journals } = await sanityFetch({
    query: getAllJournalsQuery,
  });

  return (
    <div className="bg-neutral-50 min-h-screen py-12 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bebas  mb-4 tracking-wide">
            <span className="text-blue-main">The Ezio</span>
            <span className="text-rose-600"> Journal</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Explore our stories on sustainable fashion, kids style inspiration,
            and the journey behind our collections.
          </p>
        </header>

        {journals && journals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 sm:gap-6">
            {journals.map((journal: Journal) => (
              <JournalCard key={journal._id} journal={journal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-400">
              No journal entries yet.
            </h2>
            <p className="text-gray-500 mt-2">
              Check back soon for new stories!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
