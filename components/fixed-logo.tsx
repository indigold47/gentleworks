"use client";

import { Suspense, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/** Pages where the fixed top-right logo appears. */
const LOGO_PAGES = ["/about", "/contact-us", "/projects", "/team", "/press"];

const LOGO_PATH =
  "M308.19,168.04v7.56c-1.1,9.77-2,19.45-4.76,29.35-3.39,12.15-7.24,24.05-14.67,34.3l-14.75,20.35c-14.96,20.65-32.45,29.72-55.7,39.45-11.34,4.74-22.91,8.01-35.25,8.79-23.3,1.48-52.7-3.71-71.18-17.58l-15.37-11.53c-18.09-13.58-30.63-26.34-37.52-48.73-5.96-19.36-8.14-38.87-7.14-59.2.64-13.2,3.09-25.78,6.64-38.4,7.51-26.66,26.77-47.78,50.17-61.56,5.86-3.45,11.86-5.54,18.47-7.14,12.43-3.01,24.53-5.96,37.33-7.14,7.97-.73,24.7-.91,32.35.03,10.9,1.34,21.11,3.63,31.57,6.83,18.18,5.55,33.98,15.04,47.76,28.07,19.63,18.58,28.62,51.17,32.05,76.56Z";

const LOGO_CLASSES =
  "fixed z-50 top-[calc(1.25rem+env(safe-area-inset-top))] right-[calc(1.5rem+env(safe-area-inset-right))] sm:right-[calc(2.5rem+env(safe-area-inset-right))] lg:right-[25px] h-[60px] w-[60px] transition-[transform,opacity] duration-700 ease-[var(--ease)] hover:scale-110 hover:rotate-[15deg]";

function LogoSvg({ pathRef }: { pathRef?: React.RefObject<SVGPathElement | null> }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 360 360"
      aria-hidden="true"
      width="100%"
      height="100%"
    >
      <path ref={pathRef} fill="#7a6f47" d={LOGO_PATH} className="transition-[fill] duration-700" />
    </svg>
  );
}

function FixedLogoInner() {
  const pathname = usePathname();
  const visible = LOGO_PAGES.includes(pathname);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;

    const readColor = () => {
      let color = getComputedStyle(document.documentElement).getPropertyValue("--page-theme-main").trim();

      if (!color) {
        const styled = document.querySelector<HTMLElement>('[style*="--page-theme-main"]');
        if (styled) {
          color = getComputedStyle(styled).getPropertyValue("--page-theme-main").trim();
        }
      }

      if (color) el.setAttribute("fill", color);
    };

    readColor();
    const t1 = setTimeout(readColor, 50);
    const t2 = setTimeout(readColor, 200);

    const observer = new MutationObserver(readColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return (
    <Link
      href="/"
      aria-label="Gentle Works home"
      style={{ viewTransitionName: "fixed-logo" } as React.CSSProperties}
      className={`${LOGO_CLASSES} ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <LogoSvg pathRef={pathRef} />
    </Link>
  );
}

/**
 * Single fixed-position logo rendered once in the root layout.
 * Suspense fallback renders the same logo markup so it never disappears.
 */
export function FixedLogo() {
  return (
    <Suspense
      fallback={
        <Link
          href="/"
          aria-label="Gentle Works home"
          style={{ viewTransitionName: "fixed-logo" } as React.CSSProperties}
          className={`${LOGO_CLASSES} opacity-0 pointer-events-none`}
        >
          <LogoSvg />
        </Link>
      }
    >
      <FixedLogoInner />
    </Suspense>
  );
}
