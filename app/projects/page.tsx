import Link from "next/link";

import { getAllProjectsDetail, getAllTags } from "@/sanity/lib/fetch";
import { SplitScreen } from "@/components/projects/split-screen";
import { ContactForm } from "@/components/contact-form";
import { ScrollToTop } from "@/components/scroll-to-top";

/**
 * Projects page — split-screen layout.
 *
 * Server component: fetches all projects + tags at build time (via `'use cache'`
 * in the fetch helpers), passes them down to the client SplitScreen component.
 * Filtering and URL-synced state will layer on once designs arrive.
 */
export default async function ProjectsPage() {
  const [projects, tags] = await Promise.all([
    getAllProjectsDetail(),
    getAllTags(),
  ]);

  return (
    <main className="flex flex-col">
      {/* Minimal header — matches home page for now */}
      <header className="fixed top-0 z-20 w-full flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16 bg-cream/80 backdrop-blur-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm tracking-[0.14em] uppercase"
        >
          <span
            aria-hidden
            className="inline-block h-2.5 w-2.5 rounded-full bg-sage"
          />
          Gentle Works
        </Link>
        <nav className="flex items-center gap-8 text-sm tracking-[0.1em] uppercase">
          <Link href="/projects" className="text-sage">
            Projects
          </Link>
          <Link href="/studio" className="hover:text-sage transition-colors">
            Studio
          </Link>
          <Link href="/contact" className="hover:text-sage transition-colors">
            Contact
          </Link>
        </nav>
      </header>

      {/* Push content below fixed header */}
      <div className="pt-[72px]">
        <SplitScreen projects={projects} tags={tags} />
      </div>

      {/* Contact section */}
      <section className="border-t border-rule px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <p className="text-sm uppercase tracking-[0.14em] text-muted">
          Get in touch
        </p>
        <h2 className="display mt-3 text-[clamp(2rem,5vw,4.5rem)]">
          Start a conversation
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
          Have a project in mind? We'd love to hear about it.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </section>

      <ScrollToTop />
    </main>
  );
}
