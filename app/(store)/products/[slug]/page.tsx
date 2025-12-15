import { getCatalogPage } from "@/sanity/lib/getCatalogPage";
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
  const [product, catalogPage] = await Promise.all([
    getProductBySlug(params.slug),
    getCatalogPage(),
  ]);
  if (!product) return notFound();

  return (
    <main className="w-full px-4 sm:px-5 py-4 md:py-8 bg-white pb-16">
      <ProductClient
        product={product as PDPProduct}
        whatsappNumber={catalogPage?.whatsappNumber}
      />
    </main>
  );
}
