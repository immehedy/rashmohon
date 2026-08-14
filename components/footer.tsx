import Link from "next/link";
import Image from "next/image";
import type { ComponentType } from "react";
import {
  Banknote,
  Clock,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  ShoppingBasket,
  Twitter,
  Youtube,
} from "lucide-react";
import type { SiteSettings } from "@/lib/theme-types";
import type { Locale } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";

const FALLBACK_SOCIALS = [
  { label: "Facebook", url: "https://facebook.com/rashmohon" },
  { label: "Instagram", url: "https://instagram.com/rashmohon" },
  { label: "YouTube", url: "https://youtube.com/@rashmohon" },
];

function getSocialIcon(url: string): ComponentType<{ size?: number }> {
  const u = url.toLowerCase();
  if (u.includes("facebook")) return Facebook;
  if (u.includes("instagram")) return Instagram;
  if (u.includes("youtube")) return Youtube;
  if (u.includes("twitter") || u.includes("x.com")) return Twitter;
  if (u.includes("linkedin")) return Linkedin;
  if (u.includes("whatsapp")) return MessageCircle;
  if (u.includes("tiktok")) return Music2;
  return Globe;
}

export function Footer({
  locale,
  dict,
  settings,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
}) {
  const socials = settings.socialLinks?.length
    ? settings.socialLinks
    : FALLBACK_SOCIALS;

  const hasCmsLogo = settings.logoUrl && settings.logoUrl !== "/logo.svg";
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: dict.footerHome, href: `/${locale}` },
    { label: dict.footerAllProducts, href: `/${locale}#products` },
    { label: dict.footerBasket, href: `/${locale}/basket` },
  ];

  const contactItems = [
    {
      icon: MapPin,
      label: dict.footerAddressLabel,
      value: dict.footerAddressValue,
      href: undefined,
    },
    {
      icon: Phone,
      label: dict.footerPhoneLabel,
      value: dict.footerPhoneValue,
      href: `tel:${dict.footerPhoneValue.replace(/[^+\d]/g, "")}`,
    },
    {
      icon: Mail,
      label: dict.footerEmailLabel,
      value: dict.email,
      href: `mailto:${dict.email}`,
    },
    {
      icon: Clock,
      label: dict.footerHoursLabel,
      value: dict.footerHoursValue,
      href: undefined,
    },
  ];

  return (
    // surface-dark: fixed zinc-900 chrome, independent of the CMS
    // background color. text-foreground flips to white automatically
    // because of that surface — same pattern as the header, opposite
    // color.
    <footer className="surface-dark text-white">
      <div className="container grid gap-12 py-14 md:grid-cols-2 md:py-16 lg:grid-cols-[1.4fr_1fr_1.3fr_1fr]">
        {/* Brand */}
        <div className="flex flex-col items-start gap-5">
          <Link href={`/${locale}`} className="shrink-0">
            {hasCmsLogo ? (
              <Image
                src={settings.logoUrl}
                alt={settings.logoAlt || settings.siteName}
                width={140}
                height={32}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <span className="text-2xl font-black tracking-[-0.06em] text-white">
                {settings.siteName}
              </span>
            )}
          </Link>

          <p className="max-w-xs text-sm leading-relaxed text-white/60">
            {dict.footerTagline}
          </p>

          <div className="flex items-center gap-3">
            {socials.map((social) => {
              const Icon = getSocialIcon(social.url);
              return (
                <a
                  key={social.url + social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-primary hover:bg-primary hover:text-button-text">
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label={dict.footerQuickLinks}>
          <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            {dict.footerQuickLinks}
          </h3>

          <ul className="flex flex-col items-start gap-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white">
                  <span className="h-px w-3 bg-white/30 transition-all group-hover:w-5 group-hover:bg-primary" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            {dict.footerCustomerCare}
          </h3>

          <ul className="flex flex-col gap-4">
            {contactItems.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60">
                  <item.icon size={15} />
                </span>

                <span className="flex flex-col gap-0.5 pt-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                    {item.label}
                  </span>

                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-white/75 transition-colors hover:text-white">
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm text-white/75">{item.value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Shopping info */}
        <div>
          <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            {dict.footerFollowUs}
          </h3>

          <div className="flex flex-col gap-3">
            <Link
              href={`/${locale}/basket`}
              className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white/75 transition-colors hover:border-primary hover:text-white">
              <ShoppingBasket size={18} className="text-white/50" />
              {dict.cart}
            </Link>

            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white/75">
              <Banknote size={18} className="shrink-0 text-white/50" />
              {dict.footerCod}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} {settings.siteName}. {dict.footerRights}
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
