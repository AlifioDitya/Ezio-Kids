import JournalCard from "@/components/journal/JournalCard";
import { getLatestJournalsQuery } from "@/sanity/lib/journal/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

interface Journal {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  image: SanityImageSource;
  excerpt?: string;
}

export default async function LatestJournals() {
  const { data: journals } = await sanityFetch({
    query: getLatestJournalsQuery,
  });

  if (!journals || journals.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-neutral-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-zinc-300 font-bold tracking-wider uppercase text-sm mb-2 block">
              Our Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bebas text-zinc-100 tracking-wide">
              Latest from the Journal
            </h2>
          </div>
          <Link
            href="/journal"
            className="mr-2 mb-2 group flex items-center text-zinc-300 font-semibold hover:text-zinc-200 transition-colors"
          >
            <span className="mr-2 relative after:absolute after:left-0 after:-bottom-[2px] after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-neutral-50 after:transition-transform group-hover:after:scale-x-100">
              View All Articles
            </span>
            <BsArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {journals.map((journal: Journal) => (
            <JournalCard key={journal._id} journal={journal} />
          ))}
        </div>
      </div>
    </section>
  );
}
