import type { Dictionary } from "@/lib/i18n";
import type { Locale, Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  locale,
  dict,
}: {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-2.5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-4 lg:gap-y-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          dict={dict}
        />
      ))}
    </div>
  );
}
