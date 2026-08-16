import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/contentful";
import { searchProducts, toSearchResultItem } from "@/lib/search";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const products = await getProducts();
    const results = searchProducts(products, q)
      .slice(0, 8)
      .map(toSearchResultItem);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("[api/search] failed:", err);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
