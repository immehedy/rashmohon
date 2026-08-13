import type { Dictionary } from "@/lib/i18n";
import type { Locale, Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export function RelatedProducts({
  products,
  locale,
  dict,
}: {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <div className="related-carousel">
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
