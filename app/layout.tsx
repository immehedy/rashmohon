import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RASHMOHON Online Shop",
  description: "Multilingual ecommerce starter",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
