// components/landing/BestSeller.server.tsx
import { getAllProducts } from "@/sanity/lib/collectionsPage/getAllProducts";
import BestSellerClient from "./BestSellerClient";

type ResultItem = {
  _id: string;
  name?: string | null;
  price?: number | null;
  slug?: { current?: string | null } | null;
  mainImageUrl?: string | null;
  tagInfo?: Array<{ title?: string | null; slug?: string | null }> | null;
};

export default async function BestSeller({ limit = 8 }: { limit?: number }) {
  // Only products tagged "best-seller"
  const res = await getAllProducts({
    sort: "newest",
    page: 1,
    pageSize: limit,
    tags: ["best-seller"],
  });

  const items = ((res.items ?? []) as ResultItem[]).map((p) => {
    const img = p.mainImageUrl ? p.mainImageUrl : undefined;

    const otherTag = (p.tagInfo ?? []).find((t) => t?.slug !== "best-seller");

    return {
      id: p._id,
      name: p.name ?? "",
      price: typeof p.price === "number" ? p.price : null,
      slug: p.slug?.current ?? "",
      image: img,
      badge: otherTag?.title ?? null,
    };
  });

  if (!items.length) return null;

  return <BestSellerClient items={items} />;
}
