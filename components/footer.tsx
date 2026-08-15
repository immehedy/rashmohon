import Link from "next/link";
import type { SiteSettings } from "@/lib/theme-types";
import type { Locale } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";

export function Footer({
  locale,
  dict,
  settings,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-dark text-white">
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/45 sm:flex-row">
          <p>
            © {year} {settings.siteName}. {dict.footerRights}{" "}
            <a
              href="https://fourbitit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/45 transition-colors hover:text-white">
              Fourbitit.com
            </a>
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {settings.footerNavLinks.map((link) => (
              <Link
                key={link.url + link.label}
                href={link.url}
                target={link.openInNewTab ? "_blank" : undefined}
                rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                className="transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
