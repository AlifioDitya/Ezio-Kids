import TextPage from "@/components/pages/TextPage";
import { sanityFetch } from "@/sanity/lib/live";
import { Metadata } from "next";
import { defineQuery } from "next-sanity";

const QUERY = defineQuery(`*[_type == "termsPage"][0]`);

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({ query: QUERY });
  return {
    title: page?.seo?.metaTitle || "Terms & Conditions | Ezio Kids",
    description:
      page?.seo?.metaDescription || "Terms and Conditions for Ezio Kids.",
  };
}

export default async function TermsPage() {
  const { data: page } = await sanityFetch({ query: QUERY });

  if (!page) {
    return <TextPage title="Terms & Conditions" content={[]} />;
  }

  return (
    <TextPage
      title={page.title || "Terms & Conditions"}
      content={page.content || []}
    />
  );
}
