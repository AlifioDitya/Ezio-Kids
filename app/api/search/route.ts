// app/api/search/route.ts
import { getSearchResults } from "@/sanity/lib/search/getSearchResults";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const limit = Number(url.searchParams.get("limit") || 8);

  // Parse filters
  const toArray = (key: string) => {
    const val = url.searchParams.get(key);
    return val ? val.split(",").filter(Boolean) : [];
  };

  const sizes = toArray("size");
  const categories = toArray("cat");
  const fabrics = toArray("fabric");
  const collarTypes = toArray("collar");
  const tags = toArray("tag");
  const trueColors = toArray("tcolor");
  const sleeves = toArray("sleeve");

  if (!q) {
    return NextResponse.json({ q, products: [], suggestions: [], total: 0 });
  }

  const res = await getSearchResults({
    q,
    limit,
    sizes,
    categories,
    fabrics,
    collarTypes,
    tags,
    trueColors,
    sleeves,
  });
  return NextResponse.json(res);
}
