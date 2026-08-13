import { notFound } from "next/navigation";
import { translations } from "@/lib/i18n";
import { getProductBySlug, getRelatedProducts } from "@/lib/contentful";
import { ProductDetailsClient } from "@/components/product-details-client";
import { RelatedProducts } from "@/components/related-products";
import type { Locale } from "@/lib/types";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const dict = translations[locale];
  const related = await getRelatedProducts(product);

  return (
    <main>
      <section className="section">
        <div className="container">
          <ProductDetailsClient
            product={product}
            locale={locale}
            dict={dict}
          />
        </div>
      </section>

      {related.length > 0 && (
        <section className="section pt-2">
          <div className="container">
            <h2 className="mb-5 text-2xl font-black tracking-tight">
              {dict.related}
            </h2>

            <RelatedProducts
              products={related}
              locale={locale}
              dict={dict}
            />
          </div>
        </section>
      )}
    </main>
  );
}
