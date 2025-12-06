// components/layout/HeaderWithSaleClient.tsx
"use client";

import { Sale } from "@/sanity.types";
import { usePathname } from "next/navigation";
import Header from "./Header";

function formatShort(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function HeaderWithSaleClient({ sale }: { sale: Sale | null }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Sticky on home; normal flow elsewhere
  const wrapperClass = isHome
    ? "sticky top-0 z-50 w-full bg-white"
    : "w-full bg-white";

  return (
    <div className={wrapperClass}>
      {sale ? (
        <div
          aria-live="polite"
          className="w-full bg-orange-50/90 backdrop-blur text-orange-900/90 text-center text-[11px] font-medium tracking-wide py-1.5 px-3 border-b border-orange-100"
        >
          <span className="font-semibold">{sale.title}</span>
          {sale.discountAmount ? <> — {sale.discountAmount}% off</> : null}
          {sale.couponCode ? (
            <>
              {" — use code "}
              <span className="font-mono font-bold tracking-wider">
                {sale.couponCode}
              </span>
            </>
          ) : null}
          {sale.validUntil ? <> · Ends {formatShort(sale.validUntil)}</> : null}
        </div>
      ) : null}

      <Header />
    </div>
  );
}
