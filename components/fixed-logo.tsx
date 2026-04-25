"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/** Pages where the fixed top-right logo appears. */
const LOGO_PAGES = ["/about", "/contact-us", "/projects", "/team"];

const LOGO_PATH =
  "M308.19,168.04v7.56c-1.1,9.77-2,19.45-4.76,29.35-3.39,12.15-7.24,24.05-14.67,34.3l-14.75,20.35c-14.96,20.65-32.45,29.72-55.7,39.45-11.34,4.74-22.91,8.01-35.25,8.79-23.3,1.48-52.7-3.71-71.18-17.58l-15.37-11.53c-18.09-13.58-30.63-26.34-37.52-48.73-5.96-19.36-8.14-38.87-7.14-59.2.64-13.2,3.09-25.78,6.64-38.4,7.51-26.66,26.77-47.78,50.17-61.56,5.86-3.45,11.86-5.54,18.47-7.14,12.43-3.01,24.53-5.96,37.33-7.14,7.97-.73,24.7-.91,32.35.03,10.9,1.34,21.11,3.63,31.57,6.83,18.18,5.55,33.98,15.04,47.76,28.07,19.63,18.58,28.62,51.17,32.05,76.56Z";

function FixedLogoInner() {
  const pathname = usePathname();
  const visible = LOGO_PAGES.includes(pathname);

  return (
    <Link
      href="/"
      aria-label="Gentle Works home"
      className={`fixed z-50 top-12 right-12 h-[67px] w-[67px] max-lg:top-auto max-lg:right-auto max-lg:bottom-6 max-lg:left-6 max-lg:h-10 max-lg:w-10 transition-all duration-700 ease-[var(--ease)] hover:scale-110 hover:rotate-[15deg] ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 360 360"
        aria-hidden="true"
        width="100%"
        height="100%"
      >
        <path fill="#7a6f47" d={LOGO_PATH} />
      </svg>
    </Link>
  );
}

/**
 * Single fixed-position logo rendered once in the root layout.
 * Always the same size and position so it never shifts during navigation.
 */
export function FixedLogo() {
  return (
    <Suspense fallback={null}>
      <FixedLogoInner />
    </Suspense>
  );
}
