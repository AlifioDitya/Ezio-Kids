// components/layout/HeaderWithSale.server.tsx
import { getActiveSale } from "@/sanity/lib/commerce/getActiveSale";
import HeaderWithSaleClient from "./HeaderWithSaleClient";

export default async function HeaderWithSale() {
  const sale = await getActiveSale(); // ActiveSale | null
  return <HeaderWithSaleClient sale={sale} />;
}
