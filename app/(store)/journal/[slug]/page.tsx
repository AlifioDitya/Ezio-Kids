import { urlFor } from "@/sanity/lib/image";
import { getJournalBySlugQuery } from "@/sanity/lib/journal/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { format } from "date-fns";
import { Metadata } from "next";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BsArrowLeft } from "react-icons/bs";

interface JournalSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: JournalSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: journal } = await sanityFetch({
    query: getJournalBySlugQuery,
    params: { slug },
  });

  if (!journal) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: journal.seo?.metaTitle || journal.title,
    description: journal.seo?.metaDescription || journal.excerpt,
    openGraph: {
      images: [urlFor(journal.image).width(1200).height(630).url()],
    },
  };
}

export default async function JournalSlugPage({
  params,
}: JournalSlugPageProps) {
  const { slug } = await params;
  const { data: journal } = await sanityFetch({
    query: getJournalBySlugQuery,
    params: { slug },
  });

  if (!journal) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative h-[80svh] w-full bg-gray-100">
        {journal.image && (
          <Image
            src={urlFor(journal.image).width(1920).height(1080).url()}
            alt={journal.image.alt || journal.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div className="max-w-4xl text-white space-y-4">
            <h1 className="text-4xl md:text-6xl font-bebas tracking-wider drop-shadow-md">
              {journal.title}
            </h1>
            <div className="flex items-center justify-center space-x-2 font-manrope text-sm md:text-base font-medium uppercase tracking-wider opacity-90">
              <span>
                {format(new Date(journal.publishedAt), "MMMM d, yyyy")}
              </span>
              <span>•</span>
              <span>Ezio Kids Journal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        {/* Navigation Back */}
        <Link
          href="/journal"
          className="inline-flex items-center text-blue-main hover:text-blue-main/90 font-medium mb-8 transition-colors"
        >
          <BsArrowLeft className="mr-2" />
          <p>Back to Journal</p>
        </Link>

        <div className="prose prose-lg max-w-none font-manrope leading-relaxed">
          {journal.content && (
            <PortableText
              value={journal.content}
              components={{
                block: {
                  h1: ({ children }) => (
                    <h1 className="text-3xl md:text-4xl font-bebas tracking-wide text-blue-main mb-6 mt-10">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl md:text-3xl font-bebas tracking-wide text-blue-main mb-4 mt-8">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold font-manrope text-blue-main mb-3 mt-6">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-bold font-manrope text-blue-main mb-2 mt-6">
                      {children}
                    </h4>
                  ),
                  normal: ({ children }) => (
                    <p className="mb-6 text-gray-700 leading-relaxed text-base">
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-rose-600 pl-4 italic my-8 text-gray-700 font-medium">
                      {children}
                    </blockquote>
                  ),
                },
                types: {
                  image: ({ value }) => {
                    return (
                      <div className="relative w-full h-96 my-16 overflow-hidden rounded-lg">
                        <Image
                          src={urlFor(value).width(800).url()}
                          alt={value.alt || "Journal Image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    );
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </article>
  );
}
