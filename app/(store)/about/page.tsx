import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { GET_ABOUT_PAGE_QUERY } from "@/sanity/lib/products/queries";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { Metadata } from "next";
import { PortableText } from "next-sanity";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const { data: aboutPage } = await sanityFetch({
    query: GET_ABOUT_PAGE_QUERY,
  });

  return {
    title: aboutPage?.seoTitle || "About Us | Ezio Kids",
    description:
      aboutPage?.seoDescription ||
      "Learn about Ezio Kids, our mission to create sustainable, playful, and durable clothing for children.",
  };
}

interface AboutPageValue {
  title: string;
  description: string;
  icon: SanityImageSource;
}

export default async function AboutPage() {
  const { data: aboutPage } = await sanityFetch({
    query: GET_ABOUT_PAGE_QUERY,
  });

  if (!aboutPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold">Content is being updated.</h1>
      </div>
    );
  }

  return (
    <main className="w-full bg-white">
      {/* 1. Hero Section */}
      <section className="relative h-[95vh] w-full bg-gray-900">
        {aboutPage.heroImage && (
          <Image
            src={urlFor(aboutPage.heroImage).width(1920).quality(90).url()}
            alt={aboutPage.heroHeading}
            fill
            priority
            className="object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div className="max-w-4xl space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas text-white tracking-wide drop-shadow-xl">
              {aboutPage.heroHeading}
            </h1>
            {aboutPage.heroSubheading && (
              <p className="text-lg md:text-2xl font-manrope font-medium text-gray-100 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                {aboutPage.heroSubheading}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Brand Story Section */}
      <section className="py-20 md:py-32 container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1 h-[600px] w-full rounded-2xl overflow-hidden shadow-sm">
            {aboutPage.storyImage && (
              <Image
                src={urlFor(aboutPage.storyImage).url()}
                alt={aboutPage.storyTitle || "Our Story"}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <span className="text-zinc-500 font-bold tracking-wider uppercase text-sm">
              Our Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-bebas text-zinc-900 tracking-wide leading-tight">
              {aboutPage.storyTitle}
            </h2>
            <div className="prose prose-lg text-zinc-600 font-manrope">
              {aboutPage.storyContent && (
                <PortableText value={aboutPage.storyContent} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values Section */}
      {aboutPage.values && aboutPage.values.length > 0 && (
        <section className="py-20 bg-neutral-50 mb-20 md:mb-32">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bebas text-zinc-900 tracking-wide">
                What We Stand For
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {aboutPage.values.map((value: AboutPageValue, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center space-y-2"
                >
                  <div className="w-64 aspect-video mb-8 rounded-sm overflow-hidden relative">
                    {value.icon && (
                      <Image
                        src={urlFor(value.icon).width(1000).url()}
                        alt={value.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <h3 className="text-2xl font-bebas text-zinc-800 tracking-wide">
                    {value.title}
                  </h3>
                  <p className="text-zinc-600 font-manrope leading-relaxed max-w-xs">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
