"use client";

import { MouseEvent, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import useWishlistStore from "@/store/wishlist";
import type { Product } from "@/sanity.types";

type Props = {
  productId: string;
  slug?: string; // slug.current
  name?: string;
  mainImage?: Product["mainImage"];
  unitPrice: number;
  variantKey?: string; // for PDP variant-aware saving (optional)
  shadow?: boolean; // drop-shadow on outline icon
  className?: string; // extra positioning/styles

  /** NEW: customize the outline (unsaved) heart color */
  emptyColor?: string; // CSS color string (e.g. "#111827" | "rgb(17,24,39)")
  /** Optional Tailwind class for color (use only if safelisted) */
  emptyClassName?: string; // e.g. "text-gray-900"
};

export default function WishlistFloaty({
  productId,
  slug,
  name,
  mainImage,
  unitPrice,
  variantKey,
  shadow = true,
  className,
  emptyColor = "#ffffff", // default stays white
  emptyClassName, // optional TW class override
}: Props) {
  const items = useWishlistStore((s) => s.items);
  const addItem = useWishlistStore((s) => s.addItem);
  const removeItem = useWishlistStore((s) => s.removeItem);

  const isSaved = useMemo(
    () =>
      items.some(
        (i) =>
          i.product._id === productId &&
          i.variantKey === (variantKey ?? i.variantKey)
      ),
    [items, productId, variantKey]
  );

  // one-shot ripple when toggled ON
  const [burstKey, setBurstKey] = useState(0);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeItem(productId, variantKey);
    } else {
      addItem({
        product: { _id: productId, slug, name, mainImage },
        unitPrice,
        variantKey,
      });
      setBurstKey((k) => k + 1);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      className={`
        absolute right-2 top-2 z-10 inline-flex h-9 w-9 items-center justify-center
        focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500
        ${className ?? ""}
      `}
    >
      {/* Ripple burst when toggled ON */}
      <AnimatePresence initial={false}>
        {isSaved && (
          <motion.span
            key={burstKey}
            className="absolute inset-0 rounded-full"
            initial={{ scale: 0.6, opacity: 0.35 }}
            animate={{ scale: 1.45, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(circle, rgba(244,63,94,0.25) 0%, rgba(244,63,94,0) 60%)",
            }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Heart icon with playful pop */}
      <motion.span
        key={isSaved ? "on" : "off"}
        initial={{ scale: 0.9, opacity: 0.95 }}
        animate={{ scale: isSaved ? [1, 1.2, 1] : 1, opacity: 1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: isSaved ? 0.22 : 0.15 }}
        className={`${shadow ? "drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.45)]" : ""} ${
          isSaved ? "drop-shadow-none" : ""
        }`}
      >
        {isSaved ? (
          <MdFavorite className="h-6 w-6 text-rose-500" />
        ) : (
          <MdFavoriteBorder
            className={`h-6 w-6 hover:scale-110 transition-transform ${emptyClassName ?? ""}`}
            style={emptyClassName ? undefined : { color: emptyColor }}
          />
        )}
      </motion.span>

      <span className="sr-only">{isSaved ? "Saved" : "Not saved"}</span>
    </button>
  );
}
