import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <main id="main-content" className="relative h-dvh w-full overflow-hidden">
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/3165763e-5418-49cd-a0a5-c652b5f4158c/KI_optimist+hall-7-web+copy.jpg')",
        }}
      />

      {/* Down arrow — centered at bottom */}
      <Link
        href="/projects"
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-cream/80 hover:text-cream transition-colors animate-bounce"
        aria-label="View projects"
      >
        <ChevronDown className="h-10 w-10" strokeWidth={1.5} />
      </Link>

      {/* LinkedIn — bottom right */}
      <a
        href="https://www.linkedin.com/company/gentleworks/about/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-12 right-6 z-10 text-cream/80 hover:text-cream transition-colors"
        aria-label="LinkedIn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
    </main>
  );
}
