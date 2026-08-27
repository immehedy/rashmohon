import { SiteSettings, SiteTheme } from "@/lib/theme-types";

// This is the theme you already have today. Anything Contentful doesn't
// provide falls back to these values field-by-field, so a half-filled
// entry in the CMS never breaks the layout.
export const DEFAULT_THEME: SiteTheme = {
  backgroundColor: "#ffffff",
  textColor: "#1a1a1a",
  primaryColor: "#0f62fe",
  secondaryColor: "#6f6f6f",
  buttonColor: "#0f62fe",
  buttonTextColor: "#ffffff",
  fontFamily: "Inter",
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "Rashmohon",
  logoUrl: "/logo.svg",
  logoAlt: "Rashmohon logo",
  heroImages: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2200&q=85",
  ],
  theme: DEFAULT_THEME,
  seo: {
    title: "Rashmohon",
    description: "Default site description",
    keywords: [],
  },
  headerNavLinks: [{ label: "Home", url: "/" }],
  footerNavLinks: [],
  footerText: `© ${new Date().getFullYear()} Rashmohon. All rights reserved.`,
  socialLinks: [],
  analytics: {},
};
