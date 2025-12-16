import TextPage from "@/components/pages/TextPage";
import { sanityFetch } from "@/sanity/lib/live";
import { Metadata } from "next";
import { defineQuery } from "next-sanity";

const QUERY = defineQuery(`*[_type == "accessibilityPage"][0]`);

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({ query: QUERY });
  return {
    title: page?.seo?.metaTitle || "Accessibility Statement | Ezio Kids",
    description:
      page?.seo?.metaDescription || "Accessibility Statement for Ezio Kids.",
  };
}

export default async function AccessibilityPage() {
  const { data: page } = await sanityFetch({ query: QUERY });

  if (!page) {
    return <TextPage title="Accessibility Statement" content={[]} />;
  }

  return (
    <TextPage
      title={page.title || "Accessibility Statement"}
      content={page.content || []}
    />
  );
}
