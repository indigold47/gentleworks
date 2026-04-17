import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gentle.works"),
  title: {
    default: "Gentle Works — Architecture & Design Studio in Atlanta, GA",
    template: "%s · Gentle Works",
  },
  description:
    "Gentle Works is an Atlanta-based architecture and design studio offering architecture, planning, and interior design for hospitality, residential, and commercial projects.",
  keywords: [
    "architecture",
    "design studio",
    "interior design",
    "Atlanta architect",
    "Georgia architecture",
    "hospitality design",
    "residential design",
    "commercial architecture",
    "adaptive reuse",
    "Gentle Works",
  ],
  authors: [{ name: "Gentle Works", url: "https://gentle.works" }],
  creator: "Gentle Works",
  openGraph: {
    type: "website",
    siteName: "Gentle Works",
    locale: "en_US",
    title: "Gentle Works — Architecture & Design Studio in Atlanta, GA",
    description:
      "An Atlanta-based architecture and design studio crafting considered spaces for hospitality, residential, and commercial projects.",
    url: "https://gentle.works",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gentle Works — Architecture & Design Studio",
    description:
      "An Atlanta-based architecture and design studio crafting considered spaces for hospitality, residential, and commercial projects.",
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
    canonical: "https://gentle.works",
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
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-ink focus:text-cream focus:text-sm"
        >
          Skip to main content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Gentle Works",
              url: "https://gentle.works",
              description:
                "An Atlanta-based architecture and design studio offering architecture, planning, and interior design for hospitality, residential, and commercial projects.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "900 DeKalb Ave, Suite E",
                addressLocality: "Atlanta",
                addressRegion: "GA",
                postalCode: "30307",
                addressCountry: "US",
              },
              email: "info@gentle.works",
              sameAs: [
                "https://www.linkedin.com/company/gentleworks/about/",
              ],
              knowsAbout: [
                "Architecture",
                "Interior Design",
                "Adaptive Reuse",
                "Hospitality Design",
                "Commercial Architecture",
                "Residential Design",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
