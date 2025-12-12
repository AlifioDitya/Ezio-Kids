import { defineQuery } from "next-sanity";

export const GET_FABRIC_BY_SLUG_QUERY = defineQuery(`
  *[_type == "fabric" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    bannerImage,
    bannerTitle,
    excerpt,
    journal->{
      title,
      "slug": slug.current
    },
    weight,
    properties,
    image
  }
`);

export const GET_CATALOG_PAGE_QUERY = defineQuery(`
  *[_type == "catalogPage" && _id == "catalogPageSingleton"][0] {
    bannerImage,
    bannerTitle,
    excerpt
  }
`);

export const GET_ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == "aboutPage" && _id == "aboutPageSingleton"][0] {
    heroHeading,
    heroSubheading,
    heroImage,
    storyTitle,
    storyContent,
    storyImage,
    values,
    seoTitle,
    seoDescription
  }
`);
