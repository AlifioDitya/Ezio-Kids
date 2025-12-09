// sanity/lib/products/getProductBySlug.ts
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { defineQuery, PortableTextBlock } from "next-sanity";
import { sanityFetch } from "../live";

/** UI-friendly projection for PDP */
export type PDPProduct = {
  _id: string;
  name?: string;
  slug?: string;
  description?: PortableTextBlock[];
  careInstructions?: PortableTextBlock[];
  fabric?: {
    name?: string;
    slug?: string;
    description?: string;
    weight?: string;
    image?: SanityImageSource;
    properties?: { key?: string; value?: string }[];
  } | null;
  collarType?: {
    name?: string;
    slug?: string;
    description?: string;
    image?: SanityImageSource;
  } | null;
  features?: {
    _key: string;
    title?: string;
    description?: string;
    image?: SanityImageSource;
  }[];
  composition?: {
    _key: string;
    material?: string;
    percentage?: number;
  }[];
  arrivalDate?: string;
  price?: number;
  mainImage?: SanityImageSource & { alt?: string };
  additionalImages?: (SanityImageSource & { alt?: string })[];
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
      ageGroup?: "baby" | "toddler" | "child" | "teens";
      order?: number | null;
    } | null;
    color?: {
      _id: string;
      name?: string;
      slug?: string;
      swatch?: SanityImageSource;
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
      "fabric": fabric->{
        name,
        "slug": slug.current,
        description,
        weight,
        image,
        properties
      },
      "collarType": collarType->{
        name,
        "slug": slug.current,
        description,
        image
      },
      features,
      composition,
      arrivalDate,
      price,
      mainImage,
      additionalImages,
      "category": category->{
        _id,
        name,
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
