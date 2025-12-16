"use client";

import { urlFor } from "@/sanity/lib/image";
import { PortableText, PortableTextBlock } from "next-sanity";
import Image from "next/image";

interface TextPageProps {
  title: string;
  content: PortableTextBlock[];
}

// Helper types/functions mirrored from JournalSlugPage
interface SanityImageBlock extends PortableTextBlock {
  _type: "image";
  asset?: {
    _id?: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  alt?: string;
}

const preprocessContent = (content: PortableTextBlock[]) => {
  if (!content || !Array.isArray(content)) return [];

  const processed = [];
  let i = 0;

  while (i < content.length) {
    const current = content[i] as unknown as SanityImageBlock;
    const next = content[i + 1] as unknown as SanityImageBlock;

    const isCurrentPortrait =
      current._type === "image" &&
      (current.asset?.metadata?.dimensions?.height || 0) >
        (current.asset?.metadata?.dimensions?.width || 0);

    const isNextPortrait =
      next?._type === "image" &&
      (next?.asset?.metadata?.dimensions?.height || 0) >
        (next?.asset?.metadata?.dimensions?.width || 0);

    if (isCurrentPortrait && isNextPortrait) {
      processed.push({
        _type: "portraitPair",
        _key: current._key + "-pair",
        images: [current, next],
      });
      i += 2; // Skip next item
    } else {
      processed.push(content[i]); // Push original block
      i++;
    }
  }

  return processed;
};

export default function TextPage({ title, content }: TextPageProps) {
  const processedContent = preprocessContent(content);

  return (
    <main className="w-full bg-neutral-50 container mx-auto px-6 py-20 max-w-4xl">
      <div className="space-y-8">
        <h1 className="text-4xl md:text-5xl font-bebas text-zinc-900 tracking-wide leading-tight text-center mb-12">
          {title}
        </h1>
        <div className="prose prose-lg max-w-none leading-relaxed">
          {processedContent && processedContent.length > 0 ? (
            <PortableText
              value={processedContent}
              components={{
                block: {
                  h1: ({ children }) => (
                    <h1 className="text-3xl md:text-4xl font-bebas tracking-wide text-zinc-900 mb-6 mt-10">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl md:text-3xl font-bebas tracking-wide text-zinc-900 mb-4 mt-8">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-zinc-900 mb-3 mt-6">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-base font-semibold text-zinc-900 mb-2 mt-6">
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
                list: {
                  bullet: ({ children }) => (
                    <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                      {children}
                    </ul>
                  ),
                  number: ({ children }) => (
                    <ol className="list-decimal pl-5 mb-6 space-y-2 text-gray-700">
                      {children}
                    </ol>
                  ),
                },
                listItem: {
                  bullet: ({ children }) => (
                    <li className="pl-1 text-base leading-relaxed">
                      {children}
                    </li>
                  ),
                  number: ({ children }) => (
                    <li className="pl-1 text-base leading-relaxed">
                      {children}
                    </li>
                  ),
                },
                types: {
                  image: ({ value }) => {
                    const width = value.asset?.metadata?.dimensions?.width || 1;
                    const height =
                      value.asset?.metadata?.dimensions?.height || 1;
                    const isPortrait = height > width;

                    return (
                      <div
                        className={`relative w-full my-16 overflow-hidden rounded-lg ${
                          isPortrait ? "aspect-[4/5]" : "aspect-[3/2]"
                        }`}
                      >
                        <Image
                          src={urlFor(value)
                            .width(1920)
                            .fit("max")
                            .auto("format")
                            .url()}
                          alt={value.alt || "Image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    );
                  },
                  portraitPair: ({ value }) => {
                    return (
                      <div className="flex gap-4 my-16">
                        {value.images.map(
                          (img: SanityImageBlock, idx: number) => (
                            <div
                              key={img._key || idx}
                              className="relative w-1/2 aspect-[4/5] overflow-hidden rounded-lg"
                            >
                              <Image
                                src={urlFor(img)
                                  .width(800)
                                  .fit("max")
                                  .auto("format")
                                  .url()}
                                alt={img.alt || "Image"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )
                        )}
                      </div>
                    );
                  },
                },
              }}
            />
          ) : (
            <p className="text-center text-zinc-500 italic">
              Content pending update.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
