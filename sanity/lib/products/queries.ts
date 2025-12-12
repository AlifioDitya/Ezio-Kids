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
