import {
  getAllCategoriesCached,
  getAllCollarTypesCached,
  getAllFabricsCached,
  getAllSizesCached,
  getAllTagsCached,
} from "@/sanity/lib/collectionsPage/cache";
import { NextResponse } from "next/server";

export async function GET() {
  const [sizes, categories, tags, fabrics, collarTypes] = await Promise.all([
    getAllSizesCached(),
    getAllCategoriesCached(),
    getAllTagsCached(),
    getAllFabricsCached(),
    getAllCollarTypesCached(),
  ]);

  return NextResponse.json({
    sizes,
    categories,
    tags,
    fabrics,
    collarTypes,
  });
}
