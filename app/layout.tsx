import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-body"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Lula's Pastry",
  description: "Fresh pastry ordering and chef dashboard built with Next.js."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable}`}>
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
