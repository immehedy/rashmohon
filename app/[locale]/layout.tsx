import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { translations } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/contentful";
import type { Locale } from "@/lib/types";
import { Footer } from "@/components/footer";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale !== "en" && locale !== "bn") notFound();

  const dict = translations[locale as Locale];
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-dvh flex-col">
      <Header locale={locale as Locale} dict={dict} settings={settings} />
      <div className="flex-1">{children}</div>
      <Footer locale={locale as Locale} dict={dict} settings={settings} />
    </div>
  );
}
