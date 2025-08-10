// components/landing/NewArrival.server.tsx
import { getProducts } from "@/sanity/lib/collectionsPage/getProducts";
import NewArrivalClient from "./NewArrival.client";
import { Product } from "@/sanity.types";

export default async function NewArrival({
  limit = 15,
  windowDays = 20,
}: {
  limit?: number;
  windowDays?: number;
}) {
  const res = await getProducts({
    sort: "newest",
    page: 1,
    pageSize: limit,
    arrivalsOnly: true,
    arrivalsWindowDays: windowDays,
  });

  const items = (res.items ?? []).map((p: Product) => ({
    id: p._id,
    name: p.name,
    price: p.price,
    slug: p?.slug?.current ?? "",
    mainImage: p.mainImage,
  }));

  if (!items.length) return null; // nothing to show

  return <NewArrivalClient items={items} />;
}
