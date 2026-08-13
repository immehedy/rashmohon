import Image from "next/image";
import Link from "next/link";
import type { Category, Locale } from "@/lib/types";

export function CategoryCarousel({
  categories,
  locale,
}: {
  categories: Category[];
  locale: Locale;
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/${locale}?category=${category.slug}`}
          className="w-[150px] shrink-0"
        >
          <div className="aspect-square overflow-hidden rounded-xl bg-neutral-100">
            <Image
              src={category.image}
              alt={locale === "bn" ? category.nameBn : category.name}
              width={500}
              height={500}
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
            />
          </div>
          <div className="mt-2 text-sm font-bold">
            {locale === "bn" ? category.nameBn : category.name}
          </div>
        </Link>
      ))}
    </div>
  );
}
