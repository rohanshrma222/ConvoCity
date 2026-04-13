import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://convo-city-web.vercel.app"),
  title: {
    default: "ConvoCity",
    template: "%s | ConvoCity",
  },
  description: "A spatial collaboration platform for teams to work together in shared virtual spaces.",
  openGraph: {
    title: "ConvoCity",
    description: "A spatial collaboration platform for teams to work together in shared virtual spaces.",
    url: "https://convo-city-web.vercel.app",
    siteName: "ConvoCity",
    images: [
      {
        url: "/assets/socialpreview.png",
        width: 1200,
        height: 630,
        alt: "ConvoCity social preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConvoCity",
    description: "A spatial collaboration platform for teams to work together in shared virtual spaces.",
    images: ["/assets/socialpreview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
