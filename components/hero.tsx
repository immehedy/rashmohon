"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";

export function Hero({
  locale,
  dict,
  heroImages,
}: {
  locale: "en" | "bn";
  dict: Dictionary;
  heroImages: string[];
}) {
  const images = heroImages.length > 0 ? heroImages : [FALLBACK_IMAGE];
  const [index, setIndex] = useState(0);

  // Auto-rotate only if there's more than one image — a single image
  // (or the default) just renders statically, no timer needed.
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section className="relative aspect-[21/9] overflow-hidden text-white">
      {images.map((src, i) => (
        <div
          key={src + i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `linear-gradient(90deg,rgba(0,0,0,.62),rgba(0,0,0,.08)),url(${src})`,
            opacity: i === index ? 1 : 0,
          }}
          aria-hidden={i !== index}
        />
      ))}

      {/* <div className="container relative flex min-h-[500px] items-end">
        <div className="max-w-2xl pb-16">
          <div className="text-[11px] font-bold uppercase tracking-[.16em]">
            RASHMOHON Online Shop
          </div>
          <h1 className="mt-3 text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-7xl">
            {locale === "bn"
              ? "আপনার পছন্দ, আপনার স্টাইল"
              : "Your style, your choice"}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/90">
            {locale === "bn"
              ? "সেরা পণ্য সহজে অর্ডার করুন এবং ক্যাশ অন ডেলিভারিতে পেমেন্ট করুন।"
              : "Discover carefully selected products and order easily with cash on delivery."}
          </p>
          <Link
            href={`/${locale}#products`}
            className="btn mt-7 bg-white text-black hover:bg-neutral-100">
            {dict.shopNow}
          </Link>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-6 right-0 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div> */}
    </section>
  );
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2200&q=85";
