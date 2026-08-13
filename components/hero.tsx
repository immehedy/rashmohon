import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";

export function Hero({
  locale,
  dict,
}: {
  locale: "en" | "bn";
  dict: Dictionary;
}) {
  return (
    <section
      className="min-h-[500px] bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(90deg,rgba(0,0,0,.62),rgba(0,0,0,.08)),url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2200&q=85)",
      }}>
      <div className="container flex min-h-[500px] items-end">
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
      </div>
    </section>
  );
}
