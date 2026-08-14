import Link from "next/link";
import type { SiteSettings } from "@/lib/theme-types";
import type { Dictionary } from "@/lib/i18n";

export function Footer({
  dict,
  settings,
}: {
  dict: Dictionary;
  settings: SiteSettings;
}) {
  return (
    <footer className="w-full border-t border-black/5 bg-background text-text">
      <div className="container flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-secondary">{settings.footerText}</p>

        <nav className="flex flex-wrap items-center gap-4">
          {settings.footerNavLinks.map((link) => (
            <Link
              key={link.url + link.label}
              href={link.url}
              target={link.openInNewTab ? "_blank" : undefined}
              rel={link.openInNewTab ? "noopener noreferrer" : undefined}
              className="text-sm text-secondary transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        {!!settings.socialLinks?.length && (
          <div className="flex items-center gap-4">
            {settings.socialLinks.map((link) => (
              <a
                key={link.url + link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-secondary transition-colors hover:text-primary">
                {link.label}
              </a>
            ))}
          </div>
        )}

        <p className="text-xs text-secondary">{dict.contact}</p>
      </div>
    </footer>
  );
}
