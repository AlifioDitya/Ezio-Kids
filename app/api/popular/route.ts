// app/api/popular/route.ts
import { NextResponse } from "next/server";
import { getPopularTags } from "@/sanity/lib/search/getPopularTags";

export const revalidate = 600; // cache for 10 min

export async function GET() {
  const tags = await getPopularTags();
  return NextResponse.json({ tags });
}
