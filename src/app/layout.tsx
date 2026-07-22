import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "BuildSpace",
  description: "BuildSpace application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${newsreader.variable} font-sans bg-[#faf9f7] antialiased`}>
        {children}
      </body>
    </html>
  );
}
