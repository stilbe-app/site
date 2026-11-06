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
  title: "Stilbe: the AI-native browser",
  description: "Stilbe, the AI-native browser for Mac: an agent built for the browser, and a browser built for the agent.",
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
