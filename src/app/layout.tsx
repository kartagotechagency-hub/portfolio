import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kartagotech.agency";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KartagoTech Agency — Digital Solutions for Ambitious Businesses",
    template: "%s",
  },
  description:
    "We turn ideas into digital solutions that move businesses forward. Web development, custom software, AI & automation, and digital transformation across France and worldwide.",
  openGraph: {
    type: "website",
    siteName: "KartagoTech Agency",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans bg-[#F5F5F2] text-[#111318] antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
