import type { Metadata } from "next";
import { ViewTransition } from "react";

import { HomeAboutView } from "@/components/home-about-view";
import { getAboutPage } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "Gentle Works is an Atlanta, Georgia-based design practice offering architecture, planning, and interior design services committed to a humane and enduring built environment.",
  alternates: { canonical: "https://gentle.works/about" },
};

const FALLBACK_IMAGE_URL =
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/3165763e-5418-49cd-a0a5-c652b5f4158c/KI_optimist+hall-7-web+copy.jpg";

export default async function AboutPage() {
  const data = await getAboutPage();

  const heroUrl = data?.heroImage
    ? urlFor(data.heroImage).width(1600).quality(80).auto("format").url()
    : FALLBACK_IMAGE_URL;

  const mainColor = data?.theme?.mainColor;

  return (
    <ViewTransition
      enter={{ "page-nav": "page-enter", default: "none" }}
      exit={{ "page-nav": "page-exit", default: "none" }}
      default="none"
    >
      <HomeAboutView
        startAt="about"
        heroUrl={heroUrl}
        mainColor={mainColor}
        aboutBody={data?.body ?? null}
      />
    </ViewTransition>
  );
}
