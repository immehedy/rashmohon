import type { Product } from "./types";

export type SearchResultItem = {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  price: number;
  discountedPrice: number | null;
  image: string;
  categoryName: string;
  categoryNameBn: string;
};

export function searchProducts<T extends Product>(products: T[], query: string): T[] {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  return products.filter((product) => {
    const haystack = `${product.name} ${product.nameBn}`.toLowerCase();
    return tokens.every((token) => haystack.includes(token));
  });
}

export function toSearchResultItem(product: Product): SearchResultItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    nameBn: product.nameBn,
    price: product.price,
    discountedPrice: product.discountedPrice,
    image: product.images[0],
    categoryName: product.categoryName,
    categoryNameBn: product.categoryNameBn,
  };
}
