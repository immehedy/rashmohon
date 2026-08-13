import { translations } from "@/lib/i18n";
import { getCategories, getProducts } from "@/lib/contentful";
import { Hero } from "@/components/hero";
import { CategoryCarousel } from "@/components/category-carousel";
import { ProductGrid } from "@/components/product-grid";
import { hasLocaleData } from "@/lib/types";
import type { Locale } from "@/lib/types";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = translations[locale];

  const [allCategories, allProducts] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const categories = allCategories.filter((category) =>
    locale === "bn" ? Boolean(category.nameBn) : Boolean(category.name)
  );

  const products = allProducts.filter((product) =>
    hasLocaleData(product, locale)
  );

  return (
    <>
      <Hero locale={locale} dict={dict} />

      <main>
        <section className="section">
          <div className="container">
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-2xl font-black tracking-tight">
                {dict.categories}
              </h2>
            </div>
            <CategoryCarousel categories={categories} locale={locale} />
          </div>
        </section>

        <section id="products" className="section pt-0">
          <div className="container">
            <h2 className="mb-5 text-2xl font-black tracking-tight">
              {dict.products}
            </h2>
            <ProductGrid
              products={products}
              locale={locale}
              dict={dict}
            />
          </div>
        </section>
      </main>
    </>
  );
}
