import { translations } from "@/lib/i18n";
import { BasketClient } from "@/components/basket-client";
import type { Locale } from "@/lib/types";

export default async function BasketPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <main className="section">
      <div className="container">
        <BasketClient
          locale={locale}
          dict={translations[locale]}
        />
      </div>
    </main>
  );
}
