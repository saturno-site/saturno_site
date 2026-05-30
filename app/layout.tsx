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
  metadataBase: new URL("https://saturnosesouza.com"),
  title: "Saturno | Landing Page Demo",
  description:
    "A polished landing page demo for client feedback, built with Next.js and Tailwind CSS.",
  openGraph: {
    title: "Saturno | Landing Page Demo",
    description:
      "A polished landing page demo for client feedback, built with Next.js and Tailwind CSS.",
    type: "website",
    url: "https://saturnosesouza.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saturno | Landing Page Demo",
    description:
      "A polished landing page demo for client feedback, built with Next.js and Tailwind CSS.",
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
