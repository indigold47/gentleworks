import type { Metadata } from "next";
import { ViewTransition } from "react";

import { TeamView } from "@/components/team/team-view";
import { getAllTeamMembers } from "@/sanity/lib/fetch";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the team behind Gentle Works — architects, designers, and makers crafting considered spaces.",
  alternates: { canonical: "https://gentle.works/team" },
};

export default async function TeamPage() {
  const members = await getAllTeamMembers();

  return (
    <ViewTransition
      enter={{ "page-nav": "page-enter", default: "none" }}
      exit={{ "page-nav": "page-exit", default: "none" }}
      default="none"
    >
      <main id="main-content">
        <TeamView members={members} />
      </main>
    </ViewTransition>
  );
}
