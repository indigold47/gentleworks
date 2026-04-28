import type { Metadata } from "next";
import { ViewTransition } from "react";

import { TeamView } from "@/components/team/team-view";
import { getAllTeamMembers, getTeamPage } from "@/sanity/lib/fetch";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the team behind Gentle Works — architects, designers, and makers crafting considered spaces.",
  alternates: { canonical: "https://gentle.works/team" },
};

export default async function TeamPage() {
  const [members, pageData] = await Promise.all([
    getAllTeamMembers(),
    getTeamPage(),
  ]);

  const mainColor = pageData?.theme?.mainColor;

  return (
    <ViewTransition
      enter={{ "page-nav": "page-enter", default: "none" }}
      exit={{ "page-nav": "page-exit", default: "none" }}
      default="none"
    >
      <main
        id="main-content"
        style={mainColor ? { "--page-theme-main": mainColor } as React.CSSProperties : undefined}
      >
        <TeamView members={members} themeColor={mainColor} />
      </main>
    </ViewTransition>
  );
}
