import { defineQuery } from "next-sanity";

export const getAllFabricsQuery = defineQuery(`
  *[_type == "fabric"] {
    _id,
    name,
    "slug": slug.current,
    description,
    image,
    bannerImage,
    excerpt,
    weight,
    properties,
    journal->{
      title,
      "slug": slug.current
    }
  }
`);
