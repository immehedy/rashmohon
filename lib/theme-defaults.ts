

// This is the theme you already have today. Anything Contentful doesn't
// provide falls back to these values field-by-field, so a half-filled

import { SiteSettings, SiteTheme } from "./theme-types";

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
  theme: DEFAULT_THEME,
  seo: {
    title: "Rashmohon",
    description: "Default site description",
    keywords: [],
  },
  footerNavLinks: [],
  footerText: `© ${new Date().getFullYear()} Rashmohon. All rights reserved.`,
  socialLinks: [],
};
