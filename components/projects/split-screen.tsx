"use client";

import type { ProjectDetail, TagItem } from "@/sanity/lib/fetch";
import { ProjectSection } from "./project-section";

type SplitScreenProps = {
  projects: ProjectDetail[];
  tags: TagItem[];
};

/**
 * Full-page split-screen projects view.
 *
 * Each project is a full-viewport section: sticky hero image on the left,
 * scrollable info on the right. Once the right-side content is fully scrolled
 * the next project naturally enters the viewport.
 *
 * Tag filtering and URL-synced state will layer on top of this once designs
 * arrive — the data + props are already here.
 */
export function SplitScreen({ projects, tags }: SplitScreenProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-24">
        <p className="text-muted">No projects yet.</p>
      </div>
    );
  }

  return (
    <div>
      {projects.map((project, i) => (
        <ProjectSection
          key={project._id}
          project={project}
          isFirst={i === 0}
        />
      ))}
    </div>
  );
}
