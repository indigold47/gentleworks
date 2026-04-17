import type { Metadata } from "next";
import { SiteNav } from "@/components/projects/projects-nav";

export const metadata: Metadata = {
  title: "About",
  description:
    "Gentle Works is an Atlanta, Georgia-based design practice offering architecture, planning, and interior design services committed to a humane and enduring built environment.",
  alternates: { canonical: "https://gentle.works/about" },
};

export default function AboutPage() {
  return (
    <main id="main-content" className="flex flex-col">
      <div className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
        {/* Left: image + nav */}
        <div className="relative h-[50svh] sticky top-0 lg:h-svh bg-[#e8ddd4]">
          {/* Placeholder background — swap to real image later */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url('https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/3165763e-5418-49cd-a0a5-c652b5f4158c/KI_optimist+hall-7-web+copy.jpg')",
            }}
          />
          <SiteNav activeHref="/about" variant="dark" />
        </div>

        {/* Right: about text */}
        <div className="relative flex flex-col px-8 py-12 sm:px-12 lg:px-16 lg:py-16">
          {/* Olive circle — branding element */}
          <div
            aria-hidden
            className="absolute top-6 right-6 h-12 w-12 rounded-full bg-[#6b6346] lg:top-12 lg:right-12"
          />

          {/* Vertical accent bar */}
          <div
            aria-hidden
            className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-32 bg-[#6b6346] rounded-full"
          />

          <div className="max-w-lg display text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.45] text-ink/80">
            <h1 className="sr-only">About Gentle Works</h1>
            <p>
              <em>Gentle Works</em> is an Atlanta, Georgia-based design practice
              offering architecture, planning, and interior design services to
              clients who share our commitment to the pursuit of a humane and
              enduring built environment.
            </p>

            <p className="mt-8">
              We approach our work with optimism and curiosity, striving to
              design spaces which are not only beautiful, but sympathetic and
              responsive to the cultural, environmental, and economic conditions
              in which we find them.
            </p>

            <p className="mt-8">
              We take small and large projects alike, but in every case we seek
              to craft places that serve people, to enrich the experience of
              everyday life, to foster social connection and commerce, and to
              leave a built legacy flexible enough to respond to human needs and
              desires not yet considered.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
