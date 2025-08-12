// sanity/lib/getPopularTags.ts
import { sanityFetch } from "../live";

export type PopularTag = { title: string; slug: string };

export async function getPopularTags(): Promise<PopularTag[]> {
  const query = `
    array::unique(
      *[_type == "popular"]{
        // Concatenate tags + categories into one array per doc
        "items":
          coalesce(tags[]->{ 
            "title": coalesce(title, name, slug.current),
            "slug": slug.current
          }, [])
        +
          coalesce(categories[]->{ 
            "title": coalesce(title, name, slug.current),
            "slug": slug.current
          }, [])
      }.items[]
    )
    | order(title asc)
  `;

  const res = await sanityFetch({ query });
  // GROQ already returns a 1-D array of objects, so just return it.
  return (res?.data ?? []) as PopularTag[];
}
