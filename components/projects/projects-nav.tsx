import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Project Index", href: "/projects" },
  { label: "Our Team", href: "/team" },
  { label: "Contact Us", href: "/contact-us" },
];

type SiteNavProps = {
  /** The href of the currently active page. */
  activeHref: string;
  /** Use "dark" on light backgrounds for contrast. Default is "light" (cream text over images). */
  variant?: "light" | "dark";
  /** Override the nav container classes (e.g. to remove absolute positioning). */
  className?: string;
};

const variants = {
  light: {
    active: "text-cream",
    arrow: "text-cream/70",
    idle: "text-cream/80 hover:text-cream",
  },
  dark: {
    active: "text-default-green",
    arrow: "text-default-green/60",
    idle: "text-default-green/70 hover:text-default-green",
  },
};

/**
 * Vertical overlay navigation for split-screen pages.
 * Sits on top of a left-side image panel.
 * Active item renders in italic serif with a horizontal arrow line.
 */
export function SiteNav({ activeHref, variant = "light", className }: SiteNavProps) {
  const v = variants[variant];

  return (
    <nav className={className ?? "absolute top-0 left-0 right-0 z-10 flex flex-col gap-1 px-6 pt-6 sm:px-10 sm:pt-10 lg:px-12 lg:pt-12"}>
      {navItems.map((item) => {
        const isActive = item.href === activeHref;
        return isActive ? (
          <div key={item.href} className="flex items-center gap-4">
            <Link
              href={item.href}
              className={`display italic text-[22px] leading-snug tracking-wide ${v.active} shrink-0 font-bold`}
            >
              {item.label}
            </Link>
            {/* Arrow line — hidden on mobile, shown on lg+ */}
            <span className={`hidden lg:flex items-center grow min-w-0 ${v.arrow}`} aria-hidden>
              <span className="block h-px grow bg-current" />
              <svg className="shrink-0 h-[10px] w-[10px] -ml-px" viewBox="0 0 10 10" fill="none">
                <path d="M2 1.5 L8 5 L2 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            transitionTypes={["page-nav"]}
            className={`text-[22px] leading-snug tracking-wide font-normal ${v.idle} transition-colors`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
