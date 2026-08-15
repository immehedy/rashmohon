import "./globals.css";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/contentful";
import { themeToCssVariables, googleFontHref } from "@/lib/theme-utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const { seo, siteName } = settings;

  return {
    title: seo.title || siteName,
    description: seo.description,
    keywords: seo.keywords,
    icons: seo.faviconUrl ? [{ url: seo.faviconUrl }] : undefined,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    openGraph: {
      title: seo.title || siteName,
      description: seo.description,
      siteName,
      images: seo.ogImageUrl ? [{ url: seo.ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title || siteName,
      description: seo.description,
      images: seo.ogImageUrl ? [seo.ogImageUrl] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const cssVars = themeToCssVariables(settings.theme);
  const fontHref = googleFontHref(settings.theme.fontFamily);

  return (
    <html lang="en">
      <head>
        {/*
          Server-rendered CSS variable overrides from Contentful — no
          flash of the default theme, since this is written before any
          HTML paints.
        */}
        <style
          id="theme-vars"
          dangerouslySetInnerHTML={{ __html: `:root{${cssVars}}` }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={fontHref} />
      </head>
      <body>{children}</body>
    </html>
  );
}
