"use client";

import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const name = locale === "bn" ? product.nameBn : product.name;

  function handleOrderNow() {
    addItem(product);
    router.push(`/${locale}/basket`);
  }

  return (
    <article className="product-card space-y-2 border p-2 bg-white border-zinc-200">
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="block space-y-2">
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

      <div className="mt-2 grid grid-cols-2 gap-1.5 mb-2">
        <button
          className="btn min-h-7 min-w-0 px-1 rounded-sm text-[12px]"
          onClick={() => addItem(product)}>
          <span className="truncate">{dict.addToCart}</span>
        </button>

        <button
          className="btn btn-secondary min-h-7 min-w-0 px-1 rounded-sm text-[12px]"
          onClick={handleOrderNow}>
          <span className="truncate">{dict.orderNow}</span>
        </button>
      </div>
    </article>
  );
}
