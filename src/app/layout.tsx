import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OpenPanelComponent } from "@openpanel/nextjs";
import { DATA } from "@/lib/metadata";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import {
  AuthKitProvider,
  Impersonation,
} from "@workos-inc/authkit-nextjs/components";
import { cookies } from "next/headers";
import { isEU } from "@/packages/location/location";
import { Cookies } from "@/packages/config/constants";
import { ConsentBanner } from "@/components/auth/consent-banner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import {
  Be_Vietnam_Pro,
  Inter,
  Baumans,
  Instrument_Serif,
} from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  preload: true,
  weight: "variable",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-be-vietnam-pro",
  preload: true,
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const baumans = Baumans({
  subsets: ["latin"],
  variable: "--font-baumans",
  preload: true,
  display: "swap",
  weight: ["400"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  preload: true,
  display: "swap",
  weight: ["400"],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const showTrackingConsent =
    (await isEU()) && !cookieStore.has(Cookies.TrackingConsent);

  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <head>
        <script
          defer
          data-website-id="68cd65a4f831ab2b5e0c6db4"
          data-domain="uara.ai"
          src="https://datafa.st/js/script.js"
        ></script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${beVietnamPro.variable} ${baumans.variable} ${inter.variable} ${instrumentSerif.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthKitProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
            <Impersonation />
          </AuthKitProvider>
          <OpenPanelComponent
            clientId={process.env.NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID!}
            clientSecret={process.env.OPEN_PANEL_CLIENT_SECRET!}
            trackScreenViews={true}
            disabled={process.env.NODE_ENV !== "production"}
          />
          <Toaster />
          <SpeedInsights />
          {showTrackingConsent && <ConsentBanner />}
        </ThemeProvider>
      </body>
    </html>
  );
}
