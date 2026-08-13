"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/bn") ? "bn" : "en";
  const nextLocale = locale === "en" ? "bn" : "en";

  const segments = pathname.split("/");
  segments[1] = nextLocale;
  const switchHref = segments.join("/");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="section grid min-h-[60vh] place-items-center">
      <div className="container max-w-md text-center">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-red-50">
          <AlertTriangle className="text-red-500" size={28} />
        </div>

        <h1 className="text-2xl font-black tracking-tight">
          There is something wrong in metrics
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-500">
          {locale === "bn"
            ? "এই পৃষ্ঠার তথ্য এই ভাষায় পাওয়া যায়নি। অনুগ্রহ করে অন্য ভাষায় দেখুন।"
            : "The data for this page is not available in this language. Please try the other language."}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            {locale === "bn" ? "আবার চেষ্টা করুন" : "Try again"}
          </button>

          <Link
            href={switchHref}
            className="rounded-xl border border-black px-5 py-3 text-sm font-bold transition hover:bg-neutral-50"
          >
            {locale === "bn" ? "English" : "বাংলা"}
          </Link>

          <Link
            href={`/${locale}`}
            className="text-sm font-bold text-neutral-500 underline-offset-4 hover:underline"
          >
            {locale === "bn" ? "হোমে যান" : "Go home"}
          </Link>
        </div>
      </div>
    </main>
  );
}
