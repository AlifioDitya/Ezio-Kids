// app/products/[slug]/page.tsx
import { formatMoney } from "@/lib/utils";
import {
  getProductBySlug,
  type PDPProduct,
} from "@/sanity/lib/productPage/getProductBySlug";
import { notFound } from "next/navigation";
import ProductClient from "./product-client";

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  const priceLabel = formatMoney(product.price ?? 0, "IDR");

  return (
    <main className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8 bg-white pb-16">
      <ProductClient product={product as PDPProduct} priceLabel={priceLabel} />
    </main>
  );
}
