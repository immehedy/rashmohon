"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import type { SearchResultItem } from "@/lib/search";

export function SearchInput({
  locale,
  dict,
  variant = "desktop",
  inputRef,
  onSubmitted,
}: {
  locale: Locale;
  dict: Dictionary;
  variant?: "desktop" | "mobile";
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&locale=${locale}`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const data = await res.json();
        setResults(data.results ?? []);
        setOpen(true);
      } catch {
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [query, locale]);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  function close() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function submit(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    close();
    onSubmitted?.();
    router.push(`/${locale}/search?q=${encodeURIComponent(trimmed)}`);
  }

  function goToProduct(item: SearchResultItem) {
    close();
    onSubmitted?.();
    router.push(`/${locale}/products/${item.slug}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      goToProduct(results[activeIndex]);
    } else if (e.key === "Escape") {
      e.stopPropagation();
      close();
    }
  }

  const showDropdown = open && (query.trim().length >= 2 || false);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (activeIndex >= 0 && results[activeIndex]) {
            goToProduct(results[activeIndex]);
          } else {
            submit(query);
          }
        }}
        className={`flex w-full overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 transition-colors focus-within:border-primary/40 focus-within:bg-white ${
          variant === "mobile" ? "shadow-sm" : ""
        }`}>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          placeholder={dict.search}
          className="min-w-0 flex-1 border-0 bg-transparent px-5 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground/40 [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="submit"
          aria-label={dict.search}
          className={`grid place-items-center bg-primary text-button-text transition-opacity hover:opacity-90 ${
            variant === "mobile" ? "w-14" : "w-12"
          }`}>
          <Search size={17} />
        </button>
      </form>

      {showDropdown && (results.length > 0 || !loading) && (
        <div
          id="search-suggestions"
          role="listbox"
          className={`z-50 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg ${
            variant === "mobile"
              ? "mt-2"
              : "absolute left-0 right-0 top-full mt-2"
          }`}>
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-foreground/50">
              {dict.noSearchMatches}
            </p>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto py-1">
              {results.map((item, index) => {
                const name = locale === "bn" ? item.nameBn : item.name;
                const categoryName =
                  locale === "bn" ? item.categoryNameBn : item.categoryName;
                const price = item.discountedPrice ?? item.price;
                return (
                  <li key={item.id} role="option" aria-selected={index === activeIndex}>
                    <Link
                      href={`/${locale}/products/${item.slug}`}
                      onClick={() => {
                        close();
                        onSubmitted?.();
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-center gap-3 px-3 py-2 transition-colors ${
                        index === activeIndex ? "bg-neutral-100" : "bg-white"
                      }`}>
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={name}
                          width={40}
                          height={40}
                          className="size-10 shrink-0 rounded-lg object-cover"
                        />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {name || item.name}
                        </span>
                        {categoryName && (
                          <span className="block truncate text-xs text-foreground/50">
                            {categoryName}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-sm font-extrabold">
                        ৳{price.toLocaleString()}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
