import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { translations } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

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

  return (
    <>
      <Header locale={locale as Locale} dict={dict} />
      {children}
      <Footer dict={dict} />
    </>
  );
}
