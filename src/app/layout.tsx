import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OpenPanelComponent } from "@openpanel/nextjs";
import { DATA } from "@/data/metadata";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import {
  AuthKitProvider,
  Impersonation,
} from "@workos-inc/authkit-nextjs/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: DATA.meta.home.title,
    template: `%s | ${DATA.name}`,
  },
  description: DATA.meta.home.description,
  keywords: DATA.keywords.join(", "),
  authors: [{ name: "Federico Fan", url: DATA.url }],
  creator: "Federico Fan",
  publisher: DATA.name,
  applicationName: DATA.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: DATA.url,
    siteName: DATA.name,
    title: DATA.meta.home.title,
    description: DATA.meta.home.description,
    images: [
      {
        url: DATA.meta.home.ogImage,
        width: 1200,
        height: 630,
        alt: DATA.meta.home.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DATA.meta.home.title,
    description: DATA.meta.home.description,
    images: [DATA.meta.home.ogImage],
    creator: "@FedericoFan",
    site: "@FedericoFan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: DATA.url,
  },
  verification: {
    google: "",
    yandex: "",
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressContentEditableWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(DATA.schemaOrg.organization),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthKitProvider>
            {children}
            <Impersonation />
          </AuthKitProvider>
          <OpenPanelComponent
            clientId={process.env.NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID!}
            clientSecret={process.env.OPEN_PANEL_CLIENT_SECRET!}
            trackScreenViews={true}
            disabled={process.env.NODE_ENV !== "production"}
          />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
