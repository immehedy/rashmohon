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
    <div className="flex justify-center gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] sm:justify-start sm:gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/${locale}/categories/${category.slug}`}
          className="w-[110px] shrink-0 sm:w-[150px]">
          <div className="aspect-square overflow-hidden rounded-xl bg-neutral-100">
            <Image
              src={category.image}
              alt={locale === "bn" ? category.nameBn : category.name}
              width={500}
              height={500}
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
            />
          </div>
          <div className="mt-2 text-center text-xs font-bold sm:text-left sm:text-sm">
            {locale === "bn" ? category.nameBn : category.name}
          </div>
        </Link>
      ))}
    </div>
  );
}
