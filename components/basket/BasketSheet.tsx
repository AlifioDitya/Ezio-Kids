"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import useBasketUiStore from "@/store/basket-ui";
import useBasketStore from "@/store/store";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { imageUrl } from "@/lib/imageUrl";
import { Plus, Minus, X } from "lucide-react";
import { SignInButton, useAuth } from "@clerk/nextjs";

export default function BasketSheet() {
  const { isOpen, close } = useBasketUiStore();
  const {
    items,
    increment,
    decrement,
    removeItem,
    clearBasket,
    getTotalPrice,
  } = useBasketStore();

  const empty = items.length === 0;
  const total = getTotalPrice();
  const formattedTotal = `Rp ${Math.round(total).toLocaleString("id-ID")}`;
  const { isSignedIn } = useAuth();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? undefined : close())}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="px-5 py-4 border-b">
            <SheetTitle className="text-lg">Your Basket</SheetTitle>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {empty ? (
              <EmptyCart />
            ) : (
              <ul className="space-y-4">
                {items.map(
                  ({
                    product,
                    quantity,
                    unitPrice,
                    variantKey,
                    sizeLabel,
                    colorName,
                  }) => {
                    const lineTotal = unitPrice * quantity;

                    const img = product.mainImage
                      ? imageUrl(product.mainImage)
                          ?.width(480)
                          .fit("crop")
                          .auto("format")
                          .url()
                      : null;

                    const slugPath = product.slug;
                    const lineKey = `${product._id}-${variantKey ?? "base"}`;

                    return (
                      <li
                        key={lineKey}
                        className="relative grid grid-cols-[80px_1fr] rounded-lg border p-3"
                      >
                        {/* remove (top-right) */}
                        <button
                          aria-label="Remove item"
                          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100"
                          onClick={() => removeItem(product._id, variantKey)}
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>

                        {/* image */}
                        <div className="relative h-20 w-16 rounded-md overflow-hidden bg-gray-100">
                          {img ? (
                            <Image
                              src={img}
                              alt={product.name ?? "Product"}
                              fill
                              className="object-cover aspect-square"
                            />
                          ) : null}
                        </div>

                        {/* info + controls */}
                        <div className="flex min-w-0 flex-col">
                          <Link
                            href={slugPath ? `/products/${slugPath}` : "#"}
                            className="truncate text-sm font-semibold text-gray-900 hover:underline"
                            onClick={close}
                          >
                            {product.name}
                          </Link>

                          {/* variant descriptor */}
                          <div className="mt-0.5 text-xs text-gray-500">
                            <span>Color: </span>
                            <span className="font-medium text-gray-700">
                              {colorName ?? "—"}
                            </span>
                            <span className="mx-1.5">·</span>
                            <span>Size: </span>
                            <span className="font-medium text-gray-700">
                              {sizeLabel ?? "—"}
                            </span>
                          </div>

                          {/* price & qty row */}
                          <div className="mt-3 flex items-center gap-2 w-full">
                            <div className="inline-flex items-center rounded-md border">
                              <button
                                className="inline-flex h-7 w-7 items-center justify-center hover:bg-gray-50"
                                onClick={() =>
                                  decrement(product._id, variantKey)
                                }
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-7 text-center text-sm font-medium">
                                {quantity}
                              </span>
                              <button
                                className="inline-flex h-7 w-7 items-center justify-center hover:bg-gray-50"
                                onClick={() =>
                                  increment(product._id, variantKey)
                                }
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="ml-auto text-sm font-semibold">
                              {`Rp ${Math.round(lineTotal).toLocaleString("id-ID")}`}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }
                )}
              </ul>
            )}
          </div>

          {/* Footer */}
          <SheetFooter className={cn("border-t px-5 py-4", empty && "hidden")}>
            <div className="flex w-full flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-base font-semibold">
                  {formattedTotal}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearBasket}
                >
                  Clear
                </Button>
                {isSignedIn ? (
                  <Link className="flex-1" href="/checkout" onClick={close}>
                    <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                      Checkout
                    </Button>
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <Button className="w-1/2 bg-rose-500 hover:bg-rose-600 text-white">
                      Sign in to Checkout
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function EmptyCart() {
  const closeCart = useBasketUiStore((s) => s.close);

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="h-32 w-32 rounded-full bg-gradient-to-br from-rose-100 to-indigo-100 mb-4" />
      <p className="text-sm text-gray-600">Your basket is empty.</p>
      <Link
        href="/collections/shop-all"
        className="mt-4 inline-flex items-center justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
        onClick={() => {
          closeCart();
        }}
      >
        Start shopping
      </Link>
    </div>
  );
}
