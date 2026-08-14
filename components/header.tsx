"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBasket, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import type { Dictionary } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/theme-types";

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
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
  }, [pathname]);

  const hasCmsLogo = settings.logoUrl && settings.logoUrl !== "/logo.svg";

  return (
    // surface-light: fixed white chrome that ignores the CMS background
    // color on purpose (header/footer are brand chrome, not content).
    // Everything inside uses text-foreground, which resolves to dark
    // text automatically because of that surface.
    <div className="surface-light text-foreground">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="container flex min-h-[72px] items-center justify-between gap-6 md:min-h-[88px] md:gap-10">
          <Link href={`/${locale}`} className="shrink-0">
            {hasCmsLogo ? (
              <Image
                src={settings.logoUrl}
                alt={settings.logoAlt || settings.siteName}
                width={140}
                height={32}
                priority
                className="object-contain flex-1"
              />
            ) : (
              <span className="text-2xl font-black tracking-[-0.06em] text-primary">
                {settings.siteName}
              </span>
            )}
          </Link>

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

          <div className="ml-auto flex shrink-0 items-center gap-3 md:gap-4">
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

            <Link
              href={languageHref}
              className="hidden rounded-full border border-neutral-200 px-4 py-2.5 text-xs font-medium tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary md:inline-flex">
              {dict.language}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-full border border-neutral-200 text-foreground transition-colors hover:border-primary hover:text-primary md:hidden">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`grid overflow-hidden border-black/5 transition-[grid-template-rows,opacity] duration-300 ease-in-out md:hidden ${
            menuOpen
              ? "grid-rows-[1fr] border-t opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}>
          <div className="min-h-0 overflow-hidden">
            <div className="container flex flex-col gap-4 py-5">
              <form action={`/${locale}`} className="flex overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 transition-colors focus-within:border-primary/40 focus-within:bg-white">
                <input
                  name="q"
                  placeholder={dict.search}
                  className="min-w-0 flex-1 border-0 bg-transparent px-5 py-3 text-sm text-foreground outline-none placeholder:text-foreground/40"
                />

                <button
                  type="submit"
                  aria-label={dict.search}
                  className="grid w-12 place-items-center bg-primary text-button-text transition-opacity hover:opacity-90">
                  <Search size={17} />
                </button>
              </form>

              <Link
                href={languageHref}
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-4 py-3 text-xs font-medium tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary">
                {dict.language}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
