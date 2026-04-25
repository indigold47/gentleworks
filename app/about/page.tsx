import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import { ViewTransition } from "react";

import { SiteNav } from "@/components/projects/projects-nav";
import { getAboutPage } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "Gentle Works is an Atlanta, Georgia-based design practice offering architecture, planning, and interior design services committed to a humane and enduring built environment.",
  alternates: { canonical: "https://gentle.works/about" },
};

/* ── Hardcoded fallback (used when Sanity isn't connected yet) ── */
const FALLBACK_IMAGE_URL =
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/3165763e-5418-49cd-a0a5-c652b5f4158c/KI_optimist+hall-7-web+copy.jpg";

const FALLBACK_BODY = [
  {
    p: (
      <>
        <em>Gentle Works</em> is an Atlanta, Georgia-based design practice
        offering architecture, planning, and interior design services to clients
        who share our commitment to the pursuit of a humane and enduring built
        environment.
      </>
    ),
  },
  {
    p: "We approach our work with optimism and curiosity, striving to design spaces which are not only beautiful, but sympathetic and responsive to the cultural, environmental, and economic conditions in which we find them.",
  },
  {
    p: "We take small and large projects alike, but in every case we seek to craft places that serve people, to enrich the experience of everyday life, to foster social connection and commerce, and to leave a built legacy flexible enough to respond to human needs and desires not yet considered.",
  },
];

export default async function AboutPage() {
  const data = await getAboutPage();

  const heroUrl = data?.heroImage
    ? urlFor(data.heroImage).width(1600).quality(80).auto("format").url()
    : FALLBACK_IMAGE_URL;

  return (
    <ViewTransition
      enter={{ "page-nav": "page-enter", default: "none" }}
      exit={{ "page-nav": "page-exit", default: "none" }}
      default="none"
    >
      <main id="main-content" className="flex flex-col">
        <div className="grid min-h-svh grid-cols-1 lg:grid-cols-[2fr_1fr]">
          {/* Left: image + nav */}
          <div className="relative h-[50svh] sticky top-0 lg:h-svh bg-[#e8ddd4]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url('${heroUrl}')` }}
            />
            <SiteNav activeHref="/about" variant="dark" />
          </div>

          {/* Right: about text */}
          <div className="relative flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16 lg:py-12 lg:sticky lg:top-0 lg:h-svh lg:overflow-y-auto">

            <div className="max-w-lg display text-[22px] text-ink/80" style={{ lineHeight: 1.2 }}>
              <h1 className="sr-only">About Gentle Works</h1>

              {data?.body ? (
                <PortableText value={data.body} />
              ) : (
                FALLBACK_BODY.map((item, i) => (
                  <p key={i} className={i > 0 ? "mt-8" : undefined}>
                    {item.p}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </ViewTransition>
  );
}
