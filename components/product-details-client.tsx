"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
} from "lucide-react";

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
  const category =
    locale === "bn" ? product.categoryNameBn : product.categoryName;

  const description =
    locale === "bn" ? product.descriptionBn : product.description;

  const add = () => {
    addItem(product, quantity);
  };

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Product */}
      <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
        {/* =====================================================
            PRODUCT IMAGE
        ====================================================== */}
        <div className="relative">
          <div className="group relative aspect-square overflow-hidden rounded-3xl bg-neutral-100">
            <Image
              src={product.image}
              alt={name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition duration-700 group-hover:scale-[1.025]"
            />

            {/* Category badge */}
            <div className="absolute left-5 top-5">
              <span className="rounded-full bg-white/95 px-4 py-2 text-[11px] font-bold uppercase tracking-wider shadow-sm backdrop-blur">
                {category}
              </span>
            </div>
          </div>

          {/* Small information cards */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3">
              <Truck size={18} strokeWidth={1.7} className="shrink-0" />

              <div>
                <p className="text-[11px] font-bold">
                  {locale === "bn" ? "দ্রুত ডেলিভারি" : "Fast delivery"}
                </p>

                <p className="mt-0.5 text-[10px] text-neutral-500">
                  {locale === "bn" ? "সারা বাংলাদেশ" : "Across Bangladesh"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3">
              <ShieldCheck size={18} strokeWidth={1.7} className="shrink-0" />

              <div>
                <p className="text-[11px] font-bold">
                  {locale === "bn" ? "নিরাপদ অর্ডার" : "Secure order"}
                </p>

                <p className="mt-0.5 text-[10px] text-neutral-500">
                  {locale === "bn" ? "নিরাপদ প্রক্রিয়া" : "Safe checkout"}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 sm:flex">
              <Check size={18} strokeWidth={1.7} className="shrink-0" />

              <div>
                <p className="text-[11px] font-bold">
                  {locale === "bn" ? "ক্যাশ অন ডেলিভারি" : "Cash on delivery"}
                </p>

                <p className="mt-0.5 text-[10px] text-neutral-500">
                  {locale === "bn" ? "পণ্য হাতে পেয়ে" : "Pay on delivery"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PRODUCT INFORMATION
        ====================================================== */}
        <div className="flex flex-col lg:pt-6">
          {/* Category */}
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            {category}
          </div>

          {/* Title */}
          <h1 className="mt-3 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            {name}
          </h1>

          {/* Price */}
          <div className="mt-7 flex items-end gap-3">
            <span className="text-3xl font-black tracking-tight">
              ৳{product.price.toLocaleString()}
            </span>

            <span className="pb-1 text-xs text-neutral-400">{dict.cod}</span>
          </div>

          {/* Divider */}
          <div className="my-7 h-px bg-neutral-200" />

          {/* Short description */}
          <p className="max-w-xl text-sm leading-7 text-neutral-600">
            {description}
          </p>

          {/* Quantity */}
          <div className="mt-7">
            <div className="mb-2 text-xs font-bold">{dict.quantity}</div>

            <div className="flex w-fit items-center overflow-hidden rounded-xl border border-neutral-300 bg-white">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="grid size-11 place-items-center transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label={dict.previous}>
                <Minus size={15} />
              </button>

              <span className="grid h-11 min-w-12 place-items-center border-x border-neutral-200 text-sm font-bold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                className="grid size-11 place-items-center transition hover:bg-neutral-100"
                aria-label={dict.next}>
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={add}
              className="group flex min-h-13 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white transition hover:bg-neutral-800">
              <ShoppingBag
                size={18}
                className="transition-transform group-hover:-translate-y-0.5"
              />

              {dict.addToCart}
            </button>

            <Link
              href={`/${locale}/basket`}
              onClick={add}
              className="flex min-h-13 items-center justify-center rounded-xl border border-black bg-white px-5 text-sm font-bold text-black transition hover:bg-neutral-50">
              {dict.orderNow}
            </Link>
          </div>

          {/* COD message */}
          <div className="mt-5 rounded-xl bg-neutral-50 p-4">
            <div className="flex gap-3">
              <Truck size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="text-xs font-bold">{dict.cod}</p>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  {locale === "bn"
                    ? "অর্ডার করার পর আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।"
                    : "Our representative will contact you after your order is placed."}
                </p>
              </div>
            </div>
          </div>

          {/* Product details */}
          <div className="mt-8 border-t border-neutral-200 pt-7">
            <h2 className="text-lg font-bold">{dict.details}</h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-neutral-600">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
