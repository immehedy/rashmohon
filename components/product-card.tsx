"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";
import type { Locale, Product } from "@/lib/types";
import { getDiscountPercent } from "@/lib/utils";

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
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];
  const discountPercent = getDiscountPercent(product);

  function handleOrderNow() {
    addItem(product, 1);
    router.push(`/${locale}/basket`);
  }

  return (
    <article className="product-card flex h-full flex-col space-y-2 border p-2 bg-white border-zinc-200">
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="block space-y-2">
        <div className="product-image group relative overflow-hidden">
          <Image
            src={primaryImage}
            alt={name}
            fill
            sizes="(max-width: 620px) 50vw, (max-width: 1180px) 25vw, 16vw"
            className={
              secondaryImage
                ? "transition-opacity duration-300 group-hover:opacity-0"
                : undefined
            }
          />
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={name}
              fill
              sizes="(max-width: 620px) 50vw, (max-width: 1180px) 25vw, 16vw"
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}

          {discountPercent !== null && (
            <span className="absolute right-1.5 top-1.5 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="px-0.5">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm leading-5">
            {name}
          </h3>

          {discountPercent !== null ? (
            <p className="flex items-baseline gap-1.5">
              <span className="text-sm font-extrabold">
                ৳{product.discountedPrice!.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400 line-through">
                ৳{product.price.toLocaleString()}
              </span>
            </p>
          ) : (
            <p className="text-sm font-extrabold">
              ৳{product.price.toLocaleString()}
            </p>
          )}
        </div>
      </Link>

      <div className="mt-auto grid grid-cols-2 gap-1.5 mb-2">
        <Button
          variant="primary"
          size="xs"
          className="min-w-0 px-1"
          onClick={() => addItem(product, 1)}>
          <span className="truncate">{dict.addToCart}</span>
        </Button>

        <Button
          variant="secondary"
          size="xs"
          className="min-w-0 px-1"
          onClick={handleOrderNow}>
          <span className="truncate">{dict.orderNow}</span>
        </Button>
      </div>
    </article>
  );
}
