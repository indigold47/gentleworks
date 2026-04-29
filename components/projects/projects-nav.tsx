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
  /** Optional CMS theme color — overrides the variant palette for text/arrow. */
  themeColor?: string;
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
export function SiteNav({ activeHref, variant = "light", className, themeColor }: SiteNavProps) {
  const v = variants[variant];

  // When a CMS theme color is provided, use inline styles instead of class-based colors.
  const activeStyle = themeColor ? { color: themeColor } : undefined;
  const arrowStyle = themeColor ? { color: themeColor, opacity: 0.7 } : undefined;
  const idleStyle = themeColor ? { color: themeColor, opacity: 0.8 } : undefined;

  return (
    <nav className={className ?? "absolute top-0 left-0 right-0 z-10 flex flex-col gap-1 px-6 pt-6 sm:px-10 sm:pt-10 lg:px-12 lg:pt-12"}>
      {navItems.map((item) => {
        const isActive = item.href === activeHref;
        return (
          <div key={item.href} className="flex items-center gap-4 h-[30px]">
            <Link
              href={item.href}
              transitionTypes={isActive ? undefined : ["page-nav"]}
              className={`display text-[22px] leading-snug tracking-wide shrink-0 ${
                isActive
                  ? `italic font-extrabold ${themeColor ? "" : v.active}`
                  : `not-italic hover:italic font-semibold hover:font-extrabold ${themeColor ? "transition-opacity hover:opacity-100" : v.idle} transition-colors`
              }`}
              style={isActive ? activeStyle : idleStyle}
            >
              {item.label}
            </Link>
            {isActive && (
              <svg
                className="hidden lg:block grow min-w-0 h-[14px] ml-2"
                viewBox="28.84 26 599.4 13"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <line x1="28.84" y1="32.52" x2="627.02" y2="32.52" fill="none" stroke={themeColor ?? "#7b6f47"} strokeMiterlimit="10" strokeWidth="1.3" />
                <path d="M618.14,38.76c-.19-.3-.1-.7.2-.9l8.39-5.34-8.39-5.34c-.3-.19-.39-.6-.2-.9.19-.3.6-.39.9-.2l9.25,5.89c.19.12.3.33.3.55s-.11.43-.3.55l-9.25,5.89c-.11.07-.23.1-.35.1-.21,0-.42-.11-.55-.3Z" fill={themeColor ?? "#7b6f47"} />
              </svg>
            )}
          </div>
        );
      })}
    </nav>
  );
}
