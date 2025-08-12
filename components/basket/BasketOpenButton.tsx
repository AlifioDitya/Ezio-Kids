"use client";

import useBasketUiStore from "@/store/basket-ui";
import useBasketStore from "@/store/basket";
import { CiShoppingCart } from "react-icons/ci";
import { useEffect, useState } from "react";

export default function BasketOpenButton() {
  const open = useBasketUiStore((s) => s.open);
  const totalItems = useBasketStore((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={open}
      aria-label="Cart"
      className="relative text-2xl text-gray-600 hover:text-gray-800 transition"
    >
      <CiShoppingCart />
      {mounted && totalItems > 0 && (
        <span className="absolute -right-1.5 -top-[3px] grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[8px] font-bold text-white">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}
