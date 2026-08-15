export type Locale = "en" | "bn";
import type { Document } from "@contentful/rich-text-types";

export type Product = {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  description: Document | null;
  descriptionBn: Document | null;
  price: number;
  discountedPrice: number | null;
  images: string[];
  categoryId: string;
  categoryName: string;
  categoryNameBn: string;
};

export type Category = {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  image: string;
};

export type CartItem = Product & {
  quantity: number;
};

export function hasLocaleData(product: Product, locale: Locale): boolean {
  if (locale === "bn") {
    return Boolean(product.nameBn);
  }
  return Boolean(product.name);
}
