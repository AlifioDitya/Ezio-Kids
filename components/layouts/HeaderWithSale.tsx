import { getActiveSale } from "@/sanity/lib/commerce/getActiveSale";
import { getNavData } from "@/sanity/lib/products/getNavData";
import HeaderWithSaleClient from "./HeaderWithSaleClient";

export default async function HeaderWithSale() {
  const [sale, navData] = await Promise.all([getActiveSale(), getNavData()]);

  return <HeaderWithSaleClient sale={sale} navData={navData} />;
}
