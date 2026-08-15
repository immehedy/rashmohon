"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";

import type { Dictionary } from "@/lib/i18n";
import type { Locale, Product } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { getDiscountPercent } from "@/lib/utils";

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
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const actionsRef = useRef<HTMLDivElement>(null);

  const name = locale === "bn" ? product.nameBn : product.name;
  const category =
    locale === "bn" ? product.categoryNameBn : product.categoryName;
  const description =
    locale === "bn" ? product.descriptionBn : product.description;

  const activeImage = product.images[activeImageIndex] ?? product.images[0];
  const discountPercent = getDiscountPercent(product);
  const displayPrice = product.discountedPrice ?? product.price;

  const add = () => addItem(product, quantity);

  const orderNow = () => {
    addItem(product, quantity);
    router.push(`/${locale}/basket`);
  };

  const increaseQuantity = () => setQuantity((c) => c + 1);
  const decreaseQuantity = () => setQuantity((c) => Math.max(1, c - 1));

  // Sticky mobile buy-bar appears once the main action row scrolls out of view
  useEffect(() => {
    const node = actionsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-auto max-w-7xl pb-24 lg:pb-0">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5 text-xs text-neutral-400">
        <Link href={`/${locale}`} className="hover:text-foreground">
          {locale === "bn" ? "হোম" : "Home"}
        </Link>
        <ChevronRight size={12} />
        <span className="text-neutral-500">{category}</span>
        <ChevronRight size={12} />
        <span className="truncate text-neutral-600">{name}</span>
      </div>

      {/* Product — purchase-focused: image gallery + a compact buy panel that
          fits in the viewport without scrolling past description first */}
      <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
        {/* =====================================================
            PRODUCT IMAGE
        ====================================================== */}
        <div className="relative">
          <div className="group relative aspect-square overflow-hidden rounded-3xl bg-neutral-50">
            <Image
              src={activeImage}
              alt={name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition duration-700 group-hover:scale-[1.025]"
            />

            <div className="absolute left-5 top-5 flex items-center gap-2">
              <span className="rounded-full bg-white/95 px-4 py-2 text-[11px] font-bold uppercase tracking-wider shadow-sm backdrop-blur">
                {category}
              </span>
              {discountPercent !== null && (
                <span className="rounded-full bg-red-600 px-3 py-2 text-[11px] font-bold text-white shadow-sm">
                  -{discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails — only shown when there's more than one image */}
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`${name} ${index + 1}`}
                  aria-current={index === activeImageIndex}
                  className={`relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    index === activeImageIndex
                      ? "border-black"
                      : "border-transparent hover:border-neutral-300"
                  }`}>
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Trust rail — ordered as the actual customer journey: ship → pay → trust */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10">
                <Truck size={15} strokeWidth={1.75} className="text-primary" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-foreground">
                  {locale === "bn" ? "দ্রুত ডেলিভারি" : "Fast delivery"}
                </p>
                <p className="mt-0.5 text-[10px] text-neutral-500">
                  {locale === "bn" ? "সারা বাংলাদেশ" : "Across Bangladesh"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10">
                <Check size={15} strokeWidth={1.75} className="text-primary" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-foreground">
                  {locale === "bn" ? "ক্যাশ অন ডেলিভারি" : "Cash on delivery"}
                </p>
                <p className="mt-0.5 text-[10px] text-neutral-500">
                  {locale === "bn" ? "পণ্য হাতে পেয়ে" : "Pay on delivery"}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 sm:flex">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10">
                <ShieldCheck
                  size={15}
                  strokeWidth={1.75}
                  className="text-primary"
                />
              </span>
              <div>
                <p className="text-[11px] font-bold text-foreground">
                  {locale === "bn" ? "নিরাপদ অর্ডার" : "Secure order"}
                </p>
                <p className="mt-0.5 text-[10px] text-neutral-500">
                  {locale === "bn" ? "নিরাপদ প্রক্রিয়া" : "Safe checkout"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PURCHASE PANEL — kept short on purpose (no description
            here) so the buy buttons stay above the fold
        ====================================================== */}
        <div className="flex flex-col lg:pt-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            {category}
          </div>

          <h1 className="mt-3 font-serif text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            {name}
          </h1>

          {/* Price — ticket styling, dashed edge continues the receipt motif from checkout */}
          <div className="mt-6 inline-flex w-fit flex-wrap items-baseline gap-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 py-2.5 pl-4 pr-5">
            <span className="font-serif text-3xl font-medium tabular-nums text-foreground">
              ৳{displayPrice.toLocaleString()}
            </span>
            {discountPercent !== null && (
              <>
                <span className="font-serif text-lg text-neutral-400 line-through">
                  ৳{product.price.toLocaleString()}
                </span>
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">
                  -{discountPercent}%
                </span>
              </>
            )}
            <span className="text-xs text-neutral-400">{dict.cod}</span>
          </div>

          {/* Quantity */}
          <div className="mt-7">
            <div className="mb-2 text-xs font-bold text-foreground">
              {dict.quantity}
            </div>

            <div className="flex w-fit items-center overflow-hidden rounded-xl border border-neutral-300 bg-white">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="grid size-11 place-items-center transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label={dict.previous}>
                <Minus size={15} />
              </button>
              <span className="grid h-11 min-w-12 place-items-center border-x border-neutral-200 text-sm font-bold tabular-nums">
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
          <div ref={actionsRef} className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="group"
              onClick={add}>
              <ShoppingBag
                size={18}
                className="transition-transform group-hover:-translate-y-0.5"
              />
              {dict.addToCart}
            </Button>

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              className="group"
              onClick={orderNow}>
              <Zap
                size={18}
                className="transition-transform group-hover:-translate-y-0.5"
              />
              {dict.orderNow}
            </Button>
          </div>

          {/* COD message */}
          <div className="mt-5 flex gap-3 rounded-xl bg-neutral-50 p-4">
            <Truck size={18} className="mt-0.5 shrink-0 text-neutral-500" />
            <div>
              <p className="text-xs font-bold text-foreground">{dict.cod}</p>
              <p className="mt-1 text-xs leading-5 text-neutral-500">
                {locale === "bn"
                  ? "অর্ডার করার পর আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।"
                  : "Our representative will contact you after your order is placed."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          DETAILS — full-width, below the image gallery + buy panel,
          so it never pushes the buy buttons out of view
      ====================================================== */}
      {description && (
        <div className="mt-12 border-t border-neutral-200 pt-8 lg:max-w-3xl">
          <h2 className="text-lg font-bold text-foreground">{dict.details}</h2>
          <div className="prose prose-sm mt-4 max-w-none text-sm leading-7 text-neutral-600">
            {documentToReactComponents(description)}
          </div>
        </div>
      )}

      {/* Sticky mobile buy-bar — appears once the main action row scrolls off screen */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 backdrop-blur transition-transform duration-300 lg:hidden ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}>
        <div className="container flex items-center gap-3 py-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
            <Image
              src={product.images[0]}
              alt={name}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">
              {name}
            </p>
            <p className="font-serif text-sm font-medium tabular-nums text-foreground">
              ৳{(displayPrice * quantity).toLocaleString()}
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            aria-label={dict.addToCart}
            onClick={add}>
            <ShoppingBag size={16} />
          </Button>

          <Button variant="secondary" size="sm" onClick={orderNow}>
            <Zap size={14} />
            {dict.orderNow}
          </Button>
        </div>
      </div>
    </div>
  );
}
