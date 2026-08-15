import { Product } from "./types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function getDiscountPercent(product: Product): number | null {
  if (
    product.discountedPrice == null ||
    product.discountedPrice <= 0 ||
    product.discountedPrice >= product.price
  ) {
    return null;
  }
  return Math.round(
    ((product.price - product.discountedPrice) / product.price) * 100
  );
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
