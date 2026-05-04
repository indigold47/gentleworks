import type { Metadata } from "next";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "next-sanity";
import { Logo } from "@/components/logo";

import {
  getProjectBySlug,
  getAllProjectSlugs,
  getSiteSettings,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { FadeInLeft } from "@/components/projects/fade-in-left";
import { FooterScrollToTop } from "@/components/footer-scroll-to-top";

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
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
  ]);
  if (!project) notFound();

  const footerDefaults = {
    copyrightYear: "2026",
    addressLine1: "900 DeKalb Ave, Suite E",
    addressLine2: "Atlanta, GA 30307",
    email: "info@gentle.works",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=900+DeKalb+Ave+Suite+E+Atlanta+GA+30307",
  };
  const footerYear = settings?.copyrightYear ?? footerDefaults.copyrightYear;
  const footerAddr1 = settings?.addressLine1 ?? footerDefaults.addressLine1;
  const footerAddr2 = settings?.addressLine2 ?? footerDefaults.addressLine2;
  const footerEmail = settings?.email ?? footerDefaults.email;
  const footerMapsUrl = settings?.mapsUrl ?? footerDefaults.mapsUrl;

  const mainColor = project.theme?.mainColor ?? defaultTheme.mainColor;
  const secondaryColor = project.theme?.secondaryColor ?? defaultTheme.secondaryColor;

  return (
    <ViewTransition
      enter={{
        "nav-forward": "slide-up-enter",
        default: "none",
      }}
      exit={{
        "nav-back": "fade-out-down",
        default: "none",
      }}
      default="none"
    >
    <main id="main-content" className="flex flex-col" style={{ "--theme-main": mainColor, "--theme-secondary": secondaryColor } as React.CSSProperties}>
      {/* Sticky header bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-5 sm:px-10 lg:pl-[45px] lg:pr-[25px] bg-cream/80 backdrop-blur-sm">
        <Link href="/projects" aria-label="Back to projects" transitionTypes={["nav-back"]} className="group">
          <span
            className="block h-[20px] w-[20px] transition-transform duration-300 ease-out group-hover:-translate-x-1.5"
            style={{
              backgroundColor: mainColor,
              maskImage: "url('/assets/left-arrow.svg')",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: "url('/assets/left-arrow.svg')",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
        </Link>
        <FadeInLeft onMount delay={0.1}>
          <h1 className="display text-lg sm:text-xl" style={{ color: mainColor }}>
            {project.title}
          </h1>
        </FadeInLeft>
        <Logo className="h-[60px] w-[60px] shrink-0" color={mainColor} />
      </header>

      {/* Hero + Gallery with lightbox — description/credits sit between */}
      <ProjectGallery heroImage={project.heroImage} heroVideo={project.heroVideo} galleryRows={project.galleryRows} slug={project.slug} themeColor={mainColor}>
        {/* Description + Credits */}
        <section className="grid grid-cols-1 gap-10 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:gap-[45px] lg:px-[110px] lg:pt-16 lg:pb-0">
          {/* Description */}
          <FadeInLeft>
            <div className="text-base leading-relaxed" style={{ color: mainColor }}>
              <PortableText value={project.description} />
            </div>
          </FadeInLeft>

          {/* Project info + Credits grid */}
          <FadeInLeft delay={0.1}>
          <dl className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm self-start" style={{ color: mainColor }}>
            {/* Project info */}
            {([
              ["Year Built", project.year?.toString()],
              ["Type", [...(Array.isArray(project.projectType) ? project.projectType : project.projectType ? [project.projectType] : []), ...(Array.isArray(project.projectTag) ? project.projectTag : project.projectTag ? [project.projectTag] : [])].map((v) => v.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")).join(", ") || undefined],
              ["Location", project.location],
            ] as [string, string | undefined][])
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
          </FadeInLeft>
        </section>
      </ProjectGallery>

      {/* Footer */}
      <footer className="border-t border-rule px-6 py-8 sm:px-10 lg:px-[110px]" style={{ color: mainColor, backgroundColor: secondaryColor }}>
        <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FooterScrollToTop color={mainColor} />
            <div>
              <p className="text-sm">Gentle Works</p>
              <p className="text-xs opacity-60">
                &copy; {footerYear}
              </p>
            </div>
          </div>
          <div className="text-sm text-right sm:text-right sm:order-last">
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="block hover:opacity-70 transition-opacity">{settings.phone}</a>
            )}
            <a href={`mailto:${footerEmail}`} className="block hover:opacity-70 transition-opacity">{footerEmail}</a>
          </div>
          <a
            href={footerMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 text-sm text-center hover:opacity-70 transition-opacity sm:col-span-1"
          >
            <p>{footerAddr1}</p>
            <p>{footerAddr2}</p>
          </a>
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
    </ViewTransition>
  );
}
