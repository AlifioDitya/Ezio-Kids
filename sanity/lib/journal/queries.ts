import { defineQuery } from "next-sanity";

export const getAllJournalsQuery = defineQuery(`
  *[_type == "journal"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    image,
    excerpt
  }
`);

export const getJournalBySlugQuery = defineQuery(`
  *[_type == "journal" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    image,
    content,
    seo
  }
`);

export const getLatestJournalsQuery = defineQuery(`
  *[_type == "journal"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    publishedAt,
    image,
    excerpt
  }
`);
