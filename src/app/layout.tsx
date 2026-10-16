import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  // The words are hidden for their first second anyway; waiting for the font
  // keeps it from swapping in part way through their fade.
  display: "block",
});

export const metadata: Metadata = {
  title: "Stilbe",
  description: "Stilbe, a browser for Mac with an agent built in. Coming soon.",
};

export const viewport: Viewport = {
  themeColor: "#e7eaee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
