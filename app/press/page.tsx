import type { Metadata } from "next";
import { ViewTransition } from "react";

import { PressView } from "@/components/press/press-view";
import { getAllPressItems, getPressPage } from "@/sanity/lib/fetch";

export const metadata: Metadata = {
  title: "Press",
  description:
    "Awards and press coverage for Gentle Works — architecture and design studio in Atlanta, Georgia.",
  alternates: { canonical: "https://gentle.works/press" },
};

export default async function PressPage() {
  const [items, pageData] = await Promise.all([
    getAllPressItems(),
    getPressPage(),
  ]);

  const mainColor = pageData?.theme?.mainColor;
  const secondaryColor = pageData?.theme?.secondaryColor;

  return (
    <ViewTransition
      enter={{ "page-nav": "page-enter", default: "none" }}
      exit={{ "page-nav": "page-exit", default: "none" }}
      default="none"
    >
      <main
        id="main-content"
        style={
          { "--page-theme-main": mainColor ?? "#7b6f47", "--page-theme-secondary": secondaryColor ?? mainColor ?? "#7b6f47" } as React.CSSProperties
        }
      >
        <PressView
          items={items}
          themeColor={mainColor}
          secondaryColor={secondaryColor}
        />
      </main>
    </ViewTransition>
  );
}
