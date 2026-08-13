"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { Locale, Product } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";

export function ProductDetailsClient({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const name = locale === "bn" ? product.nameBn : product.name;

  const add = () => addItem(product, quantity);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
      <div className="aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        <img src={product.image} alt={name} className="h-full w-full object-cover" />
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">
          {locale === "bn" ? product.categoryNameBn : product.categoryName}
        </div>

        <h1 className="mt-3 text-4xl font-black leading-none tracking-[-.05em] sm:text-5xl">
          {name}
        </h1>

        <div className="mt-5 text-2xl font-extrabold">
          ৳{product.price.toLocaleString()}
        </div>

        <div className="mt-7 flex w-fit items-center overflow-hidden rounded-lg border border-neutral-200">
          <button
            className="grid size-10 place-items-center"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label={dict.previous}
          >
            <Minus size={15} />
          </button>
          <span className="grid size-10 place-items-center text-sm font-bold">
            {quantity}
          </span>
          <button
            className="grid size-10 place-items-center"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label={dict.next}
          >
            <Plus size={15} />
          </button>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button className="btn" onClick={add}>
            {dict.addToCart}
          </button>

          <Link href={`/${locale}/basket`} onClick={add} className="btn btn-secondary">
            {dict.orderNow}
          </Link>
        </div>

        <div className="mt-9 border-t border-neutral-200 pt-7">
          <h2 className="text-lg font-bold">{dict.details}</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-neutral-600">
            {locale === "bn" ? product.descriptionBn : product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
