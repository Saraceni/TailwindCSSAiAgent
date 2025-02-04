import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tailwind CSS AI Agent",
  description: "Ask Tailwind CSS documentation and get answers in seconds",
  openGraph: {
    title: "Tailwind CSS AI Agent",
    description: "Ask Tailwind CSS documentation and get answers in seconds",
    url: "https://tailwind-css-ai-agent.vercel.app/", // Replace with your actual URL
    images: [
      {
        url: "/url_preview.png", // Path to the image in the public folder
        width: 1200, // Optional: specify width
        height: 600, // Optional: specify height
        alt: "Preview Image", // Optional: alt text for the image
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
