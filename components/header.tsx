"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingBasket, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import type { Dictionary } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/theme-types";

const FLAGS: Record<"en" | "bn", { flag: string; label: string }> = {
  en: { flag: "🇬🇧", label: "English" },
  bn: { flag: "🇧🇩", label: "বাংলা" },
};

export function Header({
  locale,
  dict,
  settings,
}: {
  locale: "en" | "bn";
  dict: Dictionary;
  settings: SiteSettings;
}) {
  const items = useCartStore((state) => state.items);
  const count = items.reduce((total, item) => total + item.quantity, 0);

  const [hydrated, setHydrated] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const cartCount = hydrated ? count : 0;

  const pathname = usePathname();
  const nextLocale = locale === "en" ? "bn" : "en";
  const segments = pathname.split("/");
  segments[1] = nextLocale;
  const languageHref = segments.join("/");

  useEffect(() => {
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(id);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const hasCmsLogo = settings.logoUrl && settings.logoUrl !== "/logo.svg";
  const current = FLAGS[locale];
  const next = FLAGS[nextLocale];

  return (
    <div className="surface-light text-foreground">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="container flex min-h-[72px] items-center justify-between gap-6 md:min-h-[88px]">
          <Link href={`/${locale}`} className="shrink-0 flex-1">
            {hasCmsLogo ? (
              <Image
                src={settings.logoUrl}
                alt={settings.logoAlt || settings.siteName}
                width={140}
                height={30}
                priority
                className="h-14 object-contain md:h-auto"
              />
            ) : (
              <span className="text-2xl font-black tracking-[-0.06em] text-primary">
                {settings.siteName}
              </span>
            )}
          </Link>

          {/* Desktop-only inline search bar — unchanged from original */}
          <form
            action={`/${locale}`}
            className="hidden overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 transition-colors focus-within:border-primary/40 focus-within:bg-white md:flex md:max-w-md md:flex-1">
            <input
              name="q"
              placeholder={dict.search}
              className="min-w-0 flex-1 border-0 bg-transparent px-5 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground/40"
            />
            <button
              type="submit"
              aria-label={dict.search}
              className="grid w-12 place-items-center bg-primary text-button-text transition-opacity hover:opacity-90">
              <Search size={17} />
            </button>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0 md:gap-3">
            {/* Search icon — mobile only, opens drawer below */}
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-expanded={searchOpen}
              aria-label={searchOpen ? "Close search" : dict.search}
              className={`grid size-11 place-items-center rounded-full border transition-colors md:hidden ${
                searchOpen
                  ? "border-primary bg-primary text-button-text"
                  : "border-neutral-200 text-foreground hover:border-primary hover:text-primary"
              }`}>
              {searchOpen ? <X size={19} /> : <Search size={19} />}
            </button>

            <Link
              href={languageHref}
              aria-label={`Switch to ${next.label}`}
              title={`Switch to ${next.label}`}
              className="grid size-11 place-items-center overflow-hidden rounded-full border border-neutral-200 text-lg leading-none transition-colors hover:border-primary">
              <span aria-hidden="true">{current.flag}</span>
            </Link>

            <Link
              href={`/${locale}/basket`}
              className="relative grid size-11 place-items-center rounded-full border border-neutral-200 text-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label={dict.cart}>
              <ShoppingBasket size={19} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] text-button-text">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search drawer — mobile only */}
        <div
          className={`grid overflow-hidden border-black/5 transition-[grid-template-rows,opacity] duration-300 ease-in-out md:hidden ${
            searchOpen
              ? "grid-rows-[1fr] border-t opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}>
          <div className="min-h-0 overflow-hidden">
            <div className="container py-4">
              <form
                action={`/${locale}`}
                className="flex overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 shadow-sm transition-colors focus-within:border-primary/40 focus-within:bg-white">
                <input
                  ref={inputRef}
                  name="q"
                  placeholder={dict.search}
                  className="min-w-0 flex-1 border-0 bg-transparent px-5 py-3 text-sm text-foreground outline-none placeholder:text-foreground/40"
                />
                <button
                  type="submit"
                  aria-label={dict.search}
                  className="grid w-14 place-items-center bg-primary text-button-text transition-opacity hover:opacity-90">
                  <Search size={17} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
