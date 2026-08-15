import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { translations } from "@/lib/i18n";
import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategoryId,
} from "@/lib/contentful";
import { ProductGrid } from "@/components/product-grid";
import { hasLocaleData } from "@/lib/types";
import type { Locale } from "@/lib/types";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) return {};

  const title = locale === "bn" ? category.nameBn : category.name;
  return { title };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dict = translations[locale];

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  // Locale gate on the category itself, same pattern as Home does for categories/products
  const categoryName = locale === "bn" ? category.nameBn : category.name;
  if (!categoryName) notFound();

  const allProducts = await getProductsByCategoryId(category.id);
  const products = allProducts.filter((product) =>
    hasLocaleData(product, locale)
  );

  return (
    <main>
      <section className="section pb-0">
        <div className="container">
          <nav className="mb-4 text-sm text-neutral-500">
            <Link href={`/${locale}`} className="hover:underline">
              {dict.home}
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-neutral-900">{categoryName}</span>
          </nav>

          <div className="mb-6 flex items-center gap-4">
            {category.image && (
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                <Image
                  src={category.image}
                  alt={categoryName}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                {categoryName}
              </h1>
              <p className="text-sm text-neutral-500">
                {products.length} {dict.products}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          {products.length > 0 ? (
            <ProductGrid products={products} locale={locale} dict={dict} />
          ) : (
            <p className="py-12 text-center text-neutral-500">
              {dict.noProductsInCategory}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
