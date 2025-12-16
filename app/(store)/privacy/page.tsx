import TextPage from "@/components/pages/TextPage";
import { sanityFetch } from "@/sanity/lib/live";
import { Metadata } from "next";
import { defineQuery } from "next-sanity";

const QUERY = defineQuery(`*[_type == "privacyPage"][0]`);

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({ query: QUERY });
  return {
    title: page?.seo?.metaTitle || "Privacy Policy | Ezio Kids",
    description: page?.seo?.metaDescription || "Privacy Policy for Ezio Kids.",
  };
}

export default async function PrivacyPage() {
  const { data: page } = await sanityFetch({ query: QUERY });

  if (!page) {
    return <TextPage title="Privacy Policy" content={[]} />;
  }

  return (
    <TextPage
      title={page.title || "Privacy Policy"}
      content={page.content || []}
    />
  );
}
