import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
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
          <Link href="/projects" className="hover:text-sage transition-colors">
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

      {/* Hero */}
      <section className="flex flex-1 flex-col justify-end px-6 pb-16 sm:px-10 lg:px-16 lg:pb-24">
        <h1 className="display text-[clamp(3rem,10vw,10rem)] max-w-[14ch]">
          Considered spaces,{" "}
          <span className="text-sage italic">gently</span> made.
        </h1>
        <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-base leading-relaxed text-muted">
            An architecture and design studio crafting hospitality, residential,
            and commercial projects with quiet care.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border-b border-ink pb-1 text-sm uppercase tracking-[0.14em] transition-colors hover:text-sage hover:border-sage"
          >
            View projects
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
