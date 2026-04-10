"use client";

import Image from "next/image";
import { PortableText } from "next-sanity";

import type { ProjectListItem, ProjectDetail, TagItem } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

type ProjectSectionProps = {
  project: ProjectDetail;
  /** Whether this is the very first section (affects top spacing). */
  isFirst?: boolean;
};

export function ProjectSection({ project, isFirst }: ProjectSectionProps) {
  return (
    <section
      className="grid min-h-svh grid-cols-1 lg:grid-cols-2 border-b border-rule last:border-b-0"
    >
      {/* Left: sticky hero image */}
      <div className="relative h-[50svh] lg:sticky lg:top-0 lg:h-svh">
        <Image
          src={urlFor(project.heroImage).width(1600).quality(85).auto("format").url()}
          alt={project.heroImage.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority={isFirst}
        />
      </div>

      {/* Right: scrollable project info */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 lg:py-24">
        {/* Title + year */}
        <p className="text-sm uppercase tracking-[0.14em] text-muted">
          {project.year}
          {project.location && <> · {project.location}</>}
        </p>
        <h2 className="display mt-3 text-[clamp(2rem,5vw,4.5rem)]">
          {project.title}
        </h2>

        {/* Summary */}
        <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
          {project.summary}
        </p>

        {/* Description (portable text) */}
        {project.description && (
          <div className="mt-8 max-w-lg space-y-4 text-base leading-relaxed">
            <PortableText value={project.description} />
          </div>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag._id}
                className="rounded-full border border-rule px-3 py-1 text-xs uppercase tracking-[0.1em] text-muted"
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}

        {/* Credits */}
        {project.credits && project.credits.length > 0 && (
          <dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            {project.credits.map((credit, i) => (
              <div key={i} className="contents">
                <dt className="text-muted">{credit.role}</dt>
                <dd>{credit.name}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* CTA */}
        <div className="mt-10">
          <a
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 border-b border-ink pb-1 text-sm uppercase tracking-[0.14em] transition-colors hover:text-sage hover:border-sage"
          >
            View project
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
