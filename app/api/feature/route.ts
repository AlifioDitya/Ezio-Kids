// app/api/search/featured/route.ts
import { NextResponse } from "next/server";
import { getFeaturedForSearch } from "@/sanity/lib/search/getFeaturedSearch";

export async function GET() {
  const data = await getFeaturedForSearch(45);
  return NextResponse.json(data);
}
