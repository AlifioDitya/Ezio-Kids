// sanity/lib/products/getProductBySlug.ts
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

/** UI-friendly projection for PDP */
export type PDPProduct = {
  _id: string;
  name?: string;
  slug?: string;
  gender?: "everyone" | "girls" | "boys";
  description?: string;
  careInstructions?: string;
  arrivalDate?: string;
  price?: number;
  mainImage?: unknown;
  additionalImages?: unknown[];
  category?: { _id: string; name?: string; slug?: string } | null;
  collection?: { _id: string; name?: string; slug?: string } | null;
  tags?: { _id: string; title?: string; slug?: string }[];
  variants?: {
    _key: string;
    sku?: string;
    stock?: number;
    priceOverride?: number;
    size?: {
      _id: string;
      label?: string;
      slug?: string;
      ageGroup?: "baby" | "toddler" | "child" | "youth";
      order?: number | null;
    } | null;
    color?: {
      _id: string;
      name?: string;
      slug?: string;
      swatch?: unknown;
    } | null;
  }[];
};

export async function getProductBySlug(slug: string) {
  if (!slug) return null;

  const QUERY = defineQuery(`
    *[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current,
      gender,
      description,
      careInstructions,
      arrivalDate,
      price,
      mainImage,
      additionalImages,
      "category": category->{
        _id,
        "name": coalesce(Name, name),
        "slug": slug.current
      },
      "collection": collection->{
        _id,
        name,
        "slug": slug.current
      },
      "tags": tags[]->{
        _id,
        title,
        "slug": slug.current
      },
      "variants": variants[]{
        _key,
        sku,
        stock,
        priceOverride,
        "size": size->{
          _id, label, "slug": slug.current, ageGroup, order
        },
        "color": color->{
          _id, name, "slug": slug.current, swatch
        }
      }
    }
  `);

  const res = await sanityFetch({ query: QUERY, params: { slug } });
  return res.data ?? null;
}
