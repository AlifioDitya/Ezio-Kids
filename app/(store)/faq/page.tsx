import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { sanityFetch } from "@/sanity/lib/live";
import { Metadata } from "next";
import { defineQuery, PortableText, type PortableTextBlock } from "next-sanity";

const QUERY = defineQuery(`*[_type == "faqPage"][0]`);

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({ query: QUERY });
  return {
    title: page?.seo?.metaTitle || "FAQ | Ezio Kids",
    description:
      page?.seo?.metaDescription || "Frequently Asked Questions for Ezio Kids.",
  };
}

interface FAQItem {
  question: string;
  answer: PortableTextBlock[];
  _key: string;
}

export default async function FAQPage() {
  const { data: page } = await sanityFetch({ query: QUERY });

  if (!page) {
    return (
      <main className="w-full bg-neutral-50 container mx-auto px-6 py-20 md:py-32 max-w-4xl min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-medium text-zinc-500">
          FAQ content pending update.
        </h1>
      </main>
    );
  }

  return (
    <main className="w-full bg-neutral-50 container mx-auto px-6 py-16 max-w-3xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bebas text-zinc-900 tracking-wide leading-tight">
          {page.title || "Frequently Asked Questions"}
        </h1>
      </div>

      <div className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {page.faqs?.map((faq: FAQItem) => (
            <AccordionItem key={faq._key} value={faq._key}>
              <AccordionTrigger className="text-lg font-medium text-zinc-800 hover:text-zinc-900 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="prose prose-zinc prose-sm md:prose-base max-w-none pb-4 text-zinc-600">
                <PortableText value={faq.answer} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
