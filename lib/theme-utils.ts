import { SiteTheme } from "./theme-types";

/**
 * Serializes the theme into a CSS custom-property declaration list,
 * e.g. "--color-background:#fff;--color-text:#111;..."
 * Rendered server-side into a <style> tag so there's zero flash of the
 * default theme before hydration.
 */
export function themeToCssVariables(theme: SiteTheme): string {
  return [
    `--color-background:${theme.backgroundColor}`,
    `--color-text:${theme.textColor}`,
    `--color-primary:${theme.primaryColor}`,
    `--color-secondary:${theme.secondaryColor}`,
    `--color-button:${theme.buttonColor}`,
    `--color-button-text:${theme.buttonTextColor}`,
    `--font-family-base:'${theme.fontFamily}',ui-sans-serif,system-ui,sans-serif`,
  ].join(";");
}

/**
 * Builds a Google Fonts stylesheet URL for the configured font family.
 * Assumes the CMS value is a valid Google Font name (e.g. "Inter",
 * "Poppins"). If you need self-hosted/non-Google fonts, swap this out
 * for a lookup against your own font map instead.
 */
export function googleFontHref(fontFamily: string): string {
  const family = encodeURIComponent(fontFamily.trim());
  return `https://fonts.googleapis.com/css2?family=${family}:wght@300;400;500;600;700&display=swap`;
}
