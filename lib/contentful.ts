import { createClient } from "contentful";
import { unstable_cache } from "next/cache";
import {
  products as dummyProducts,
  categories as dummyCategories,
} from "./data";
import type { Product, Category } from "./types";
import type { SiteSettings } from "./theme-types";
import { DEFAULT_SITE_SETTINGS } from "./theme-defaults";

const client =
  process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN
    ? createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
      })
    : null;

export async function getProducts(): Promise<Product[]> {
  if (!client) return dummyProducts;

  try {
    const result = await client.getEntries<any>({
      content_type: "product",
      include: 2,
    });

    // Client configured but nothing published yet in Contentful —
    // keep showing static data instead of an empty grid.
    if (result.items.length === 0) return dummyProducts;

    return result.items.map((item: any) => ({
      id: item.sys.id,
      slug: item.fields.slug,
      name: item.fields.name,
      nameBn: item.fields.nameBn ?? "",
      description: item.fields.description ?? "",
      descriptionBn: item.fields.descriptionBn ?? "",
      price: Number(item.fields.price ?? 0),
      image: item.fields.image?.fields?.file?.url
        ? `https:${item.fields.image.fields.file.url}`
        : dummyProducts[0].image,
      categoryId: item.fields.category?.sys?.id ?? "",
      categoryName: item.fields.category?.fields?.name ?? "",
      categoryNameBn: item.fields.category?.fields?.nameBn ?? "",
    }));
  } catch (err) {
    console.error("[contentful] getProducts failed, using static data:", err);
    return dummyProducts;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!client) return dummyCategories;

  try {
    const result = await client.getEntries<any>({ content_type: "category" });

    if (result.items.length === 0) return dummyCategories;

    return result.items.map((item: any) => ({
      id: item.sys.id,
      name: item.fields.name,
      nameBn: item.fields.nameBn ?? "",
      slug: item.fields.slug,
      image: item.fields.image?.fields?.file?.url
        ? `https:${item.fields.image.fields.file.url}`
        : dummyCategories[0].image,
    }));
  } catch (err) {
    console.error("[contentful] getCategories failed, using static data:", err);
    return dummyCategories;
  }
}

export async function getProductBySlug(slug: string) {
  const all = await getProducts();
  return all.find((product) => product.slug === slug);
}

export async function getRelatedProducts(product: Product) {
  const all = await getProducts();

  return all
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 12);
}

// ---------------------------------------------------------------------
// Site settings / theme / header-footer / SEO
// ---------------------------------------------------------------------

function assetUrl(asset: any): string | undefined {
  const url = asset?.fields?.file?.url;
  return url ? `https:${url}` : undefined;
}

function mapNavLinks(links: any, fallback: SiteSettings["headerNavLinks"]) {
  if (!Array.isArray(links)) return fallback;
  return links
    .map((l: any) => ({
      label: l?.fields?.label ?? "",
      url: l?.fields?.url ?? "#",
      openInNewTab: !!l?.fields?.openInNewTab,
    }))
    .filter((l) => l.label);
}

function mapSiteSettings(item: any): SiteSettings {
  const defaults = DEFAULT_SITE_SETTINGS;
  if (!item) return defaults;

  const f = item.fields ?? {};

  const heroImages = Array.isArray(f.heroImages)
    ? (f.heroImages
        .map((img: any) => assetUrl(img))
        .filter(Boolean) as string[])
    : [];

  return {
    siteName: f.siteName ?? defaults.siteName,
    logoUrl: assetUrl(f.logo) ?? defaults.logoUrl,
    logoAlt: f.logoAlt ?? f.siteName ?? defaults.logoAlt,
    heroImages: heroImages.length > 0 ? heroImages : defaults.heroImages,
    theme: {
      backgroundColor: f.backgroundColor ?? defaults.theme.backgroundColor,
      textColor: f.textColor ?? defaults.theme.textColor,
      primaryColor: f.primaryColor ?? defaults.theme.primaryColor,
      secondaryColor: f.secondaryColor ?? defaults.theme.secondaryColor,
      buttonColor: f.buttonColor ?? defaults.theme.buttonColor,
      buttonTextColor: f.buttonTextColor ?? defaults.theme.buttonTextColor,
      fontFamily: f.fontFamily ?? defaults.theme.fontFamily,
    },
    seo: {
      title: f.seoTitle ?? defaults.seo.title,
      description: f.seoDescription ?? defaults.seo.description,
      keywords: Array.isArray(f.seoKeywords)
        ? f.seoKeywords
        : defaults.seo.keywords,
      ogImageUrl: assetUrl(f.ogImage),
      faviconUrl: assetUrl(f.favicon),
      canonicalUrl: f.canonicalUrl ?? "",
    },
    headerNavLinks: mapNavLinks(f.headerNavLinks, defaults.headerNavLinks),
    footerNavLinks: mapNavLinks(f.footerNavLinks, defaults.footerNavLinks),
    footerText: f.footerText ?? defaults.footerText,
    socialLinks: mapNavLinks(f.socialLinks, defaults.socialLinks ?? []),
  };
}

async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!client) return DEFAULT_SITE_SETTINGS;

  try {
    const result = await client.getEntries<any>({
      content_type: "siteSettings",
      limit: 1,
      include: 2,
    });

    if (result.items.length === 0) return DEFAULT_SITE_SETTINGS;

    return mapSiteSettings(result.items[0]);
  } catch (err) {
    console.error("[contentful] getSiteSettings failed, using defaults:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

/**
 * Cached for 1hr, tagged "siteSettings" — call
 * revalidateTag("siteSettings") from a Contentful publish webhook
 * (see app/api/revalidate/route.ts) to bust it instantly on publish.
 * Falls back to DEFAULT_SITE_SETTINGS on any error, same as the
 * product/category fetchers above.
 */
export const getSiteSettings = unstable_cache(
  fetchSiteSettings,
  ["site-settings"],
  { revalidate: 3600, tags: ["siteSettings"] }
);
