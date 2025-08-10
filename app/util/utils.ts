import { Product } from "@/sanity.types";

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export function isSanityImage(i: unknown): i is Product["mainImage"] {
  if (!isRecord(i)) return false;
  // Use `in` to narrow, then bracket access to avoid "property doesn't exist on object"
  return (
    "_type" in i &&
    "asset" in i &&
    (i as Record<string, unknown>)["_type"] === "image"
  );
}
