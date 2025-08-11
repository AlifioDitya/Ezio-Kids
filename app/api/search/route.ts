// app/api/search/route.ts
import { NextResponse } from "next/server";
import { getSearchResults } from "@/sanity/lib/search/getSearchResults";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const limit = Number(url.searchParams.get("limit") || 8);

  if (!q) {
    return NextResponse.json({ q, products: [], suggestions: [], total: 0 });
  }

  const res = await getSearchResults({ q, limit });
  return NextResponse.json(res);
}
