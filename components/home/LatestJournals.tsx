import JournalCard from "@/components/journal/JournalCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
    <section className="py-16 bg-neutral-800 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end md:mb-12 mb-8 gap-4">
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

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent viewportClassName="overflow-visible">
            {journals.map((journal: Journal) => (
              <CarouselItem
                key={journal._id}
                className="basis-[85%] md:basis-[45%] lg:basis-[32%]"
              >
                <div className="h-full">
                  <JournalCard journal={journal} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-0 -translate-x-1/2 bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800 hover:text-white" />
            <CarouselNext className="right-auto left-12 -translate-x-1/2 bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800 hover:text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
