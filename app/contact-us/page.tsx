import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { SiteNav } from "@/components/projects/projects-nav";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach out to Gentle Works for architecture, interior design, and planning inquiries. Located at 900 DeKalb Ave in Atlanta, GA.",
  alternates: { canonical: "https://gentle.works/contact-us" },
};

export default function ContactUsPage() {
  return (
    <main id="main-content" className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
      {/* Left: video panel with nav overlay */}
      <div className="relative h-[50svh] lg:sticky lg:top-0 lg:h-svh bg-[#c4b5a3]">
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/homepage.webm"
        />
        <SiteNav activeHref="/contact-us" />
      </div>

      {/* Right: contact info + form */}
      <div className="flex flex-col px-6 py-10 sm:px-10 lg:px-16 lg:py-12">
        {/* Header: address + logo circle */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base leading-snug">
              900 DeKalb Ave, Suite E
              <br />
              Atlanta, GA 30307
            </p>
            <p className="mt-3 text-base">info@gentle.works</p>
          </div>
          {/* Logo placeholder circle */}
          <div
            aria-hidden
            className="h-14 w-14 shrink-0 rounded-full bg-sage-deep"
          />
        </div>

        {/* Divider */}
        <hr className="mt-8 border-rule" />

        {/* Intro text */}
        <h1 className="sr-only">Contact Us</h1>
        <p className="mt-8 max-w-md text-base leading-relaxed">
          If you are interested in working with us or have any inquiries, please
          fill out the form below and a member of our team will be in touch with
          you.
        </p>

        {/* Form */}
        <div className="mt-8 grow">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
