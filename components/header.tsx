"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingBasket } from "lucide-react";
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

  useEffect(() => {
    setHydrated(true);
  }, []);

  const cartCount = hydrated ? count : 0;

  const pathname = usePathname();
  const nextLocale = locale === "en" ? "bn" : "en";
  const segments = pathname.split("/");
  segments[1] = nextLocale;
  const languageHref = segments.join("/");

  const hasCmsLogo = settings.logoUrl && settings.logoUrl !== "/logo.svg";

  return (
    // surface-light: fixed white chrome that ignores the CMS background
    // color on purpose (header/footer are brand chrome, not content).
    // Everything inside uses text-foreground, which resolves to dark
    // text automatically because of that surface.
    <div className="surface-light text-foreground">
      {/* <div className="text-xs text-foreground/70">
        <div className="container flex min-h-8 items-center justify-between gap-4">
          <span className="hidden sm:block">{dict.email}</span>
          <span>{dict.contact}</span>
        </div>
      </div> */}

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="container flex min-h-[74px] items-center gap-7">
          <Link href={`/${locale}`} className="shrink-0">
            {hasCmsLogo ? (
              <Image
                src={settings.logoUrl}
                alt={settings.logoAlt || settings.siteName}
                width={140}
                height={32}
                priority
                className="object-contain"
              />
            ) : (
              <span className="text-2xl font-black tracking-[-0.06em] text-primary">
                {settings.siteName}
              </span>
            )}
          </Link>

          <form
            action={`/${locale}`}
            className="order-3 flex w-full basis-full overflow-hidden rounded-full border border-neutral-300 md:order-none md:flex-1 md:basis-auto">
            <input
              name="q"
              placeholder={dict.search}
              className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-foreground/50"
            />

            <button
              type="submit"
              aria-label={dict.search}
              className="grid w-12 place-items-center bg-primary text-button-text">
              <Search size={17} />
            </button>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link
              href={languageHref}
              className="rounded-full border border-neutral-200 px-3 py-2 text-xs text-foreground hover:border-primary hover:text-primary">
              {dict.language}
            </Link>

            <Link
              href={`/${locale}/basket`}
              className="relative grid size-11 place-items-center rounded-full border border-neutral-200 text-foreground hover:border-primary"
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
      </header>
    </div>
  );
}
