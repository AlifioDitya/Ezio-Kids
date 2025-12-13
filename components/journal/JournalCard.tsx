import { urlFor } from "@/sanity/lib/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

interface JournalCardProps {
  journal: {
    title: string;
    slug: { current: string };
    publishedAt: string;
    image: SanityImageSource;
    excerpt?: string;
  };
}

export default function JournalCard({ journal }: JournalCardProps) {
  const { title, slug, publishedAt, image, excerpt } = journal;

  return (
    <Link href={`/journal/${slug.current}`} className="group block h-full">
      <div className="flex flex-col h-full bg-neutral-100 rounded-lg overflow-hidden shadow-xs duration-300">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {image && (
            <Image
              src={urlFor(image).width(1920).fit("max").auto("format").url()}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
          <div className="absolute bottom-0 p-5 pb-6 flex flex-col flex-grow">
            <div className="text-xs font-medium text-neutral-200 mb-2 uppercase tracking-wider">
              {format(new Date(publishedAt), "MMMM d, yyyy")}
            </div>
            <h3 className="text-xl font-bold text-neutral-50 mb-1 font-bebas tracking-wider">
              {title}
            </h3>
            {excerpt && (
              <p className="text-neutral-200 text-sm line-clamp-3 leading-relaxed flex-grow">
                {excerpt}
              </p>
            )}
            <div className="mt-4 flex gap-2 items-center text-sm font-semibold text-neutral-200">
              <p className="relative w-fit after:absolute after:left-0 after:-bottom-[2px] after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-neutral-50 after:transition-transform group-hover:after:scale-x-100">
                Read Article
              </p>
              <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
