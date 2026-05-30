import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saturnodesouza.com"),
  title: "Saturno | Enneagram Personality Test",
  description:
    "A modern Enneagram personality test experience designed to help visitors discover their type and growth path.",
  openGraph: {
    title: "Saturno | Enneagram Personality Test",
    description:
      "A modern Enneagram personality test experience designed to help visitors discover their type and growth path.",
    type: "website",
    url: "https://saturnodesouza.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saturno | Enneagram Personality Test",
    description:
      "A modern Enneagram personality test experience designed to help visitors discover their type and growth path.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
