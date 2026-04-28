import type { Metadata } from "next";
import { ViewTransition } from "react";

import { ContactForm } from "@/components/contact-form";
import { SiteNav } from "@/components/projects/projects-nav";
import { getContactPage } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach out to Gentle Works for architecture, interior design, and planning inquiries. Located at 900 DeKalb Ave in Atlanta, GA.",
  alternates: { canonical: "https://gentle.works/contact-us" },
};

/* ── Hardcoded fallbacks (used when Sanity isn't connected yet) ── */
const FALLBACK = {
  addressLine1: "900 DeKalb Ave, Suite E",
  addressLine2: "Atlanta, GA 30307",
  email: "info@gentle.works",
  introText:
    "If you are interested in working with us or have any inquiries, please fill out the form below and a member of our team will be in touch with you.",
};

export default async function ContactUsPage() {
  const data = await getContactPage();

  const heroUrl = data?.heroImage
    ? urlFor(data.heroImage).width(1600).quality(80).auto("format").url()
    : null;

  const addressLine1 = data?.addressLine1 ?? FALLBACK.addressLine1;
  const addressLine2 = data?.addressLine2 ?? FALLBACK.addressLine2;
  const email = data?.email ?? FALLBACK.email;
  const introText = data?.introText ?? FALLBACK.introText;
  const mainColor = data?.theme?.mainColor;

  return (
    <ViewTransition
      enter={{ "page-nav": "page-enter", default: "none" }}
      exit={{ "page-nav": "page-exit", default: "none" }}
      default="none"
    >
      <main
        id="main-content"
        className="grid min-h-svh grid-cols-1 lg:grid-cols-[2fr_1fr]"
        style={mainColor ? { "--page-theme-main": mainColor } as React.CSSProperties : undefined}
      >
        {/* Left: background panel with nav overlay */}
        <div className="relative h-[50svh] lg:sticky lg:top-0 lg:h-svh bg-[#c4b5a3]">
          {heroUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${heroUrl}')` }}
            />
          )}
          <SiteNav activeHref="/contact-us" themeColor={mainColor} />
        </div>

        {/* Right: contact info + form */}
        <div className="bg-textured relative flex flex-col px-6 py-10 sm:px-10 lg:px-16 lg:py-12" style={mainColor ? { color: mainColor } : undefined}>
          {/* Header: address */}
          <div>
            <p className="text-base leading-snug">
              {addressLine1}
              <br />
              {addressLine2}
            </p>
            <p className="mt-3 text-base">{email}</p>
          </div>

          {/* Divider */}
          <hr className="mt-8 border-rule" />

          {/* Intro text */}
          <h1 className="sr-only">Contact Us</h1>
          <p className="mt-8 max-w-md text-base leading-relaxed">
            {introText}
          </p>

          {/* Form */}
          <div className="mt-8 grow">
            <ContactForm />
          </div>
        </div>
      </main>
    </ViewTransition>
  );
}
