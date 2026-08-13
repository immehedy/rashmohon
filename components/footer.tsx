import type { Dictionary } from "@/lib/i18n";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="mt-12 border-t border-neutral-200 bg-black text-white">
      <div className="container grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="text-xl font-black">RASHMOHON</div>
          <p className="mt-3 max-w-sm text-sm leading-7 text-neutral-400">
            Modern ecommerce starter powered by Next.js, Tailwind CSS,
            Contentful and Zustand.
          </p>
        </div>
        <div>
          <h3 className="font-bold">{dict.contact}</h3>
          <p className="mt-3 text-sm text-neutral-400">{dict.email}</p>
        </div>
        <div>
          <h3 className="font-bold">{dict.cod}</h3>
          <p className="mt-3 text-sm leading-7 text-neutral-400">
            {dict.shipping} — {dict.cod}
          </p>
        </div>
      </div>
      <div className="border-t border-neutral-800">
        <div className="container py-5 text-xs text-neutral-500">
          © {new Date().getFullYear()} RASHMOHON Online Shop
        </div>
      </div>
    </footer>
  );
}
