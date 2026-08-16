import type { Metadata } from "next";
import { translations } from "@/lib/i18n";
import { getProducts } from "@/lib/contentful";
import { ProductGrid } from "@/components/product-grid";
import { searchProducts } from "@/lib/search";
import { hasLocaleData } from "@/lib/types";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: translations[locale].search };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const dict = translations[locale];

  const allProducts = await getProducts();
  const products = allProducts.filter((product) => hasLocaleData(product, locale));
  const results = query ? searchProducts(products, query) : [];

  return (
    <main className="section">
      <div className="container">
        <h1 className="mb-2 text-2xl font-black tracking-tight">
          {query
            ? dict.searchResultsFor.replace("{query}", query)
            : dict.search}
        </h1>

        {query && (
          <p className="mb-6 text-sm text-foreground/60">
            {dict.searchResultsCount.replace(
              "{count}",
              results.length.toLocaleString()
            )}
          </p>
        )}

        {results.length > 0 ? (
          <ProductGrid products={results} locale={locale} dict={dict} />
        ) : (
          <p className="text-foreground/60">
            {query ? dict.noSearchResults : dict.searchPrompt}
          </p>
        )}
      </div>
    </main>
  );
}
