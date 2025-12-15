import { defineQuery } from "next-sanity";

export const getAllSizesQuery = defineQuery(`
  *[_type == "size"] | order(order asc) {
    _id,
    label,
    "slug": slug.current,
    chestWidth,
    torsoLength,
    ageGroup,
    order
  }
`);
