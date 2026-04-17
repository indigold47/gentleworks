import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { PortableText } from "next-sanity";

import {
  getProjectBySlug,
  getAllProjectSlugs,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { ProjectGallery } from "@/components/projects/project-gallery";

/** Fallback when no theme is assigned in the CMS. */
const defaultTheme = { mainColor: "#6b5c4a", secondaryColor: "#e8e0d8" };

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  const ogImage = urlFor(project.heroImage)
    .width(1200)
    .height(630)
    .quality(80)
    .auto("format")
    .url();

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `https://gentle.works/projects/${slug}` },
    openGraph: {
      title: `${project.title} · Gentle Works`,
      description: project.summary,
      type: "article",
      url: `https://gentle.works/projects/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.heroImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} · Gentle Works`,
      description: project.summary,
      images: [ogImage],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const mainColor = project.theme?.mainColor ?? defaultTheme.mainColor;
  const secondaryColor = project.theme?.secondaryColor ?? defaultTheme.secondaryColor;

  return (
    <main id="main-content" className="flex flex-col" style={{ "--theme-main": mainColor, "--theme-secondary": secondaryColor } as React.CSSProperties}>
      {/* Sticky header bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16 bg-cream/80 backdrop-blur-sm">
        <Link href="/projects" aria-label="Back to projects">
          <ArrowDown size={20} strokeWidth={1.5} style={{ color: mainColor }} />
        </Link>
        <h1 className="display text-lg sm:text-xl" style={{ color: mainColor }}>
          {project.title}
        </h1>
        <div
          aria-hidden
          className="h-10 w-10 shrink-0 rounded-full"
          style={{ backgroundColor: mainColor }}
        />
      </header>

      {/* Hero + Gallery with lightbox — description/credits sit between */}
      <ProjectGallery heroImage={project.heroImage} gallery={project.gallery}>
        {/* Description + Credits */}
        <section className="grid grid-cols-1 gap-10 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-16">
          {/* Description */}
          <div className="max-w-xl text-base leading-relaxed" style={{ color: mainColor }}>
            <PortableText value={project.description} />
          </div>

          {/* Project info + Credits grid */}
          <dl className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm self-start">
            {/* Project info */}
            {([
              ["Year Built", project.year?.toString()],
              ["Type", [project.projectType, project.projectTag].filter(Boolean).join(", ") || undefined],
              ["Location", project.location],
            ] as const)
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label}>
                  <dt className="display italic" style={{ color: mainColor }}>
                    {label}:
                  </dt>
                  <dd className="mt-0.5">{value}</dd>
                </div>
              ))}

            {/* Credits */}
            {project.credits &&
              ([
                ["Architect/Designer", project.credits.architectDesigner],
                ["Client", project.credits.client],
                ["Photographer", project.credits.photographer],
                ["Contractor", project.credits.contractor],
                ["MEP Engineer", project.credits.mepEngineer],
                ["Structural Engineer", project.credits.structuralEngineer],
                ["Landscape Architect", project.credits.landscapeArchitect],
                ["Construction Manager", project.credits.constructionManager],
                ["Operator", project.credits.operator],
                ["Muralist", project.credits.muralist],
                ["Branding", project.credits.branding],
                ["Other Specialists", project.credits.otherSpecialists],
                ["Cinematographer", project.credits.cinematographer],
              ] as const)
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="display italic" style={{ color: mainColor }}>
                      {label}:
                    </dt>
                    <dd className="mt-0.5">{value}</dd>
                  </div>
                ))}
          </dl>
        </section>
      </ProjectGallery>

      {/* Footer */}
      <footer className="border-t border-rule px-6 py-8 sm:px-10 lg:px-16" style={{ color: mainColor, backgroundColor: secondaryColor }}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ArrowDown
              size={16}
              strokeWidth={1.5}
              className="rotate-180"
            />
            <div>
              <p className="text-sm">Gentle Works</p>
              <p className="text-xs opacity-60">
                &copy; 2026
              </p>
            </div>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=900+DeKalb+Ave+Suite+E+Atlanta+GA+30307"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-center hover:opacity-70 transition-opacity"
          >
            <p>900 DeKalb Ave, Suite E</p>
            <p>Atlanta, GA 30307</p>
          </a>
          <div className="text-sm text-right">
            <a href="mailto:info@gentle.works" className="block hover:opacity-70 transition-opacity">info@gentle.works</a>
          </div>
        </div>
      </footer>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.summary,
            url: `https://gentle.works/projects/${project.slug}`,
            image: urlFor(project.heroImage).width(1200).height(630).quality(80).auto("format").url(),
            dateCreated: project.year?.toString(),
            locationCreated: project.location
              ? { "@type": "Place", name: project.location }
              : undefined,
            creator: {
              "@type": "Organization",
              name: "Gentle Works",
              url: "https://gentle.works",
            },
          }),
        }}
      />
    </main>
  );
}
