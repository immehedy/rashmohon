export interface NavLink {
    label: string;
    url: string;
    openInNewTab?: boolean;
  }
  
  export interface SiteTheme {
    backgroundColor: string;
    textColor: string;
    primaryColor: string;
    secondaryColor: string;
    buttonColor: string;
    buttonTextColor: string;
    /** Google Font family name, e.g. "Inter", "Poppins" */
    fontFamily: string;
  }
  
  export interface SeoMeta {
    title: string;
    description: string;
    keywords?: string[];
    ogImageUrl?: string;
    faviconUrl?: string;
    canonicalUrl?: string;
  }
  
  export interface SiteSettings {
    siteName: string;
    logoUrl: string;
    logoAlt?: string;
    theme: SiteTheme;
    seo: SeoMeta;
    footerNavLinks: NavLink[];
    footerText?: string;
    socialLinks?: NavLink[];
  }
  