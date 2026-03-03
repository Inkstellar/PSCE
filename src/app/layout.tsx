import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Purple Skull Comics - Your Premier Comic Book Emporium",
  description: "Discover the latest comic books, graphic novels, and collectibles at Purple Skull Comics Emporium. Your premier destination for all things comics!",
  keywords: ["comics", "graphic novels", "comic books", "Purple Skull", "superheroes", "manga"],
  authors: [{ name: "Purple Skull Comics" }],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "Purple Skull Comics",
    description: "Your premier comic book emporium",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
// rebuild
