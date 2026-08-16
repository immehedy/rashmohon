"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Headphones,
  Lock,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  Zap,
} from "lucide-react";

import type { Dictionary } from "@/lib/i18n";
import type { Locale, Product } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { getDiscountPercent } from "@/lib/utils";

// Renders the Contentful rich text with a bit more visual structure than
// the library's plain defaults — spaced paragraphs, a labelled sub-heading
// style, and check-marked list items so scanned specs read like specs.
const richTextOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node: unknown, children: React.ReactNode) => (
      <p className="text-sm leading-7 text-neutral-600">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (_node: unknown, children: React.ReactNode) => (
      <h3 className="mt-6 flex items-center gap-2 text-sm font-bold text-foreground first:mt-0">
        <span className="h-3.5 w-1 rounded-full bg-primary" />
        {children}
      </h3>
    ),
    [BLOCKS.HEADING_3]: (_node: unknown, children: React.ReactNode) => (
      <h4 className="mt-5 text-sm font-bold text-foreground first:mt-0">
        {children}
      </h4>
    ),
    [BLOCKS.UL_LIST]: (_node: unknown, children: React.ReactNode) => (
      <ul className="mt-3 space-y-2">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node: unknown, children: React.ReactNode) => (
      <ol className="mt-3 space-y-2">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node: unknown, children: React.ReactNode) => (
      <li className="flex items-start gap-2.5 text-sm leading-6 text-neutral-600">
        <CheckCircle2
          size={16}
          strokeWidth={2}
          className="mt-0.5 shrink-0 text-emerald-600"
        />
        <span className="[&>p]:inline">{children}</span>
      </li>
    ),
  },
};

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
  const savedAmount = product.discountedPrice
    ? product.price - product.discountedPrice
    : 0;

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

  // Reused for both the "shop with confidence" panel and can be restyled
  // independently of the top trust rail without duplicating markup logic.
  const assurances = [
    {
      icon: ShieldCheck,
      color: "emerald" as const,
      title: locale === "bn" ? "১০০% অরিজিনাল" : "100% genuine product",
      body:
        locale === "bn"
          ? "সরাসরি অনুমোদিত উৎস থেকে সংগ্রহ করা।"
          : "Sourced directly from authorized suppliers.",
    },
    {
      icon: RotateCcw,
      color: "blue" as const,
      title: locale === "bn" ? "সহজ রিটার্ন" : "Easy 7-day return",
      body:
        locale === "bn"
          ? "পছন্দ না হলে সহজেই ফেরত দিন।"
          : "Change your mind? Return it hassle-free.",
    },
    {
      icon: Lock,
      color: "violet" as const,
      title: locale === "bn" ? "নিরাপদ পেমেন্ট" : "Secure checkout",
      body:
        locale === "bn"
          ? "আপনার তথ্য সম্পূর্ণ সুরক্ষিত।"
          : "Your details are always protected.",
    },
    {
      icon: Headphones,
      color: "amber" as const,
      title: locale === "bn" ? "সার্বক্ষণিক সাপোর্ট" : "Dedicated support",
      body:
        locale === "bn"
          ? "যেকোনো প্রশ্নে আমরা পাশে আছি।"
          : "Real people, ready to help with any question.",
    },
  ];

  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  } as const;

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
        </div>

        {/* =====================================================
            PURCHASE PANEL — kept short on purpose (no description
            here) so the buy buttons stay above the fold
        ====================================================== */}
        <div className="flex flex-col lg:pt-2">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-violet-600">
            <Tag size={12} strokeWidth={2.5} />
            {category}
          </div>

          <h1 className="mt-3 font-serif text-2xl md:text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            {name}
          </h1>

          {/* Price — ticket styling, dashed edge continues the receipt motif from checkout */}
          <div className="mt-6 inline-flex w-fit flex-wrap items-baseline gap-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 py-2.5 pl-4 pr-5">
            <span className="font-serif text-xl md:text-3xl font-medium tabular-nums text-foreground">
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
          {savedAmount > 0 && (
            <p className="mt-1.5 text-xs font-medium text-emerald-600">
              {locale === "bn"
                ? `আপনি সাশ্রয় করছেন ৳${savedAmount.toLocaleString()}`
                : `You save ৳${savedAmount.toLocaleString()} on this order`}
            </p>
          )}

          {/* Quantity */}
          <div className="mt-4 md:mt-7">
            <div className="mb-2 text-xs font-bold text-foreground">
              {dict.quantity}
            </div>

            <div className="flex items-center gap-4">
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

              {quantity > 1 && (
                <span className="text-xs text-neutral-500">
                  {locale === "bn" ? "মোট" : "Total"}{" "}
                  <span className="font-bold tabular-nums text-foreground">
                    ৳{(displayPrice * quantity).toLocaleString()}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div ref={actionsRef} className="mt-6 grid gap-3 grid-cols-2">
            <Button
              variant="outline"
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
              variant="primary"
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
          <div className="mt-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-100">
              <Truck size={16} className="text-blue-600" />
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">{dict.cod}</p>
              <p className="mt-1 text-xs leading-5 text-neutral-500">
                {locale === "bn"
                  ? "অর্ডার করার পর আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।"
                  : "Our representative will contact you after your order is placed."}
              </p>
            </div>
          </div>

          {/* NEW — "Shop with confidence": additional content beneath the
              COD note, each point color-coded so the panel doesn't read
              as one long gray block. */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {assurances.map(({ icon: Icon, color, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-neutral-200 bg-white p-3.5">
                <span
                  className={`grid size-8 place-items-center rounded-full ${colorMap[color]}`}>
                  <Icon size={15} strokeWidth={1.75} />
                </span>
                <p className="mt-2.5 text-[11px] font-bold leading-tight text-foreground">
                  {title}
                </p>
                <p className="mt-1 text-[10px] leading-4 text-neutral-500">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          DETAILS — full-width, below the image gallery + buy panel,
          so it never pushes the buy buttons out of view. Restyled as
          a bordered, icon-led card with structured rich-text rendering
          (headings get an accent bar, list items get check icons)
          instead of one plain paragraph block.
      ====================================================== */}
      {description && (
        <div className="mt-12 border-t border-neutral-200 pt-8">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-primary/10">
              <ClipboardList
                size={17}
                strokeWidth={1.75}
                className="text-primary"
              />
            </span>
            <h2 className="text-lg font-bold text-foreground">
              {dict.details}
            </h2>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 lg:max-w-3xl">
              <div className="prose prose-sm max-w-none space-y-1">
                {documentToReactComponents(description, richTextOptions)}
              </div>
            </div>

            {/* Small side card echoing the authenticity point, anchoring
                the details section the same way the top trust rail does */}
            <div className="hidden h-fit w-56 shrink-0 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-5 lg:block">
              <span className="grid size-9 place-items-center rounded-full bg-emerald-100">
                <BadgeCheck size={17} className="text-emerald-600" />
              </span>
              <p className="mt-3 text-xs font-bold text-foreground">
                {locale === "bn" ? "গুণমান যাচাইকৃত" : "Quality checked"}
              </p>
              <p className="mt-1.5 text-[11px] leading-5 text-neutral-500">
                {locale === "bn"
                  ? "প্রতিটি পণ্য বিক্রির আগে যাচাই করা হয়, যাতে আপনি নিশ্চিন্তে অর্ডার করতে পারেন।"
                  : "Every item is checked before it ships, so you can order with confidence."}
              </p>
            </div>
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
            variant="outline"
            size="sm"
            aria-label={dict.addToCart}
            onClick={add}>
            <ShoppingBag size={16} />
            {dict.addToCart}
          </Button>

          <Button variant="primary" size="sm" onClick={orderNow}>
            <Zap size={14} />
            {dict.orderNow}
          </Button>
        </div>
      </div>
    </div>
  );
}
