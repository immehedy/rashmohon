"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import type { Dictionary } from "@/lib/i18n";
import type { Locale, Product } from "@/lib/types";

export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const addItem = useCartStore((state) => state.addItem);

  const name = locale === "bn" ? product.nameBn : product.name;

  return (
    <article className="product-card space-y-2">
      <Link href={`/${locale}/products/${product.slug}`} className="block space-y-2">
        <div className="product-image">
          <Image
            src={product.image}
            alt={name}
            fill
            sizes="(max-width: 620px) 50vw, (max-width: 1180px) 25vw, 16vw"
          />
        </div>

        <div className="px-0.5">
          <h3 className="text-sm leading-5">{name}</h3>
          <p className="text-sm font-extrabold">
            ৳{product.price.toLocaleString()}
          </p>
        </div>
      </Link>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          className="btn min-h-9 rounded-md px-2 text-sm"
          onClick={() => addItem(product)}
        >
          {dict.addToCart}
        </button>

        <Link
          href={`/${locale}/basket?order=${product.slug}`}
          className="btn btn-secondary min-h-9 rounded-md px-2 text-sm"
        >
          {dict.orderNow}
        </Link>
      </div>
    </article>
  );
}
