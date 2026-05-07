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
  { label: "Press", href: "/press" },
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
  const arrowColor = themeColor ?? (variant === "light" ? "#f5f1ea" : "#7b6f47");

  // Glass bubble applies on all pages that use default positioning (no className override).
  // Light variant (over dark image): dark tinted glass. Dark variant (over light bg): white-tinted glass.
  const showGlassBubble = !className;
  const glassBg = variant === "light" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.35)";
  const glassBorder = variant === "light" ? "border-white/10" : "border-black/10";

  return (
    <nav className={className ?? "absolute top-0 left-0 right-0 z-10 flex flex-col gap-3 px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] sm:px-10 sm:pt-[calc(2.5rem+env(safe-area-inset-top))] lg:px-12 lg:pt-[calc(3rem+env(safe-area-inset-top))]"}>
      {navItems.map((item) => {
        const isActive = item.href === activeHref;
        return (
          <div key={item.href} className="flex items-center gap-4 h-[30px]">
            <Link
              href={item.href}
              transitionTypes={isActive ? undefined : ["page-nav"]}
              className={`group display text-[16px] lg:text-[22px] leading-snug tracking-wide shrink-0 ${
                isActive
                  ? `font-extrabold ${themeColor ? "" : v.active}`
                  : `font-semibold ${themeColor ? "transition-opacity hover:opacity-100" : v.idle} transition-colors`
              } ${showGlassBubble ? `relative inline-flex items-center backdrop-blur-md rounded-full px-2 py-1.5 border ${glassBorder}` : ""}`}
              style={{
                ...(isActive ? activeStyle : idleStyle),
                ...(showGlassBubble ? { background: glassBg } : {}),
              }}
            >
              {/* Upright span always occupies space to fix pill width — hidden via opacity only */}
              {showGlassBubble && (
                <span aria-hidden className={`not-italic select-none transition-opacity ${isActive ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}>{item.label}</span>
              )}
              {/* Italic span is absolute so it centers within the fixed-width pill without affecting layout */}
              <span className={`${showGlassBubble ? "absolute inset-0 flex items-center justify-center transition-opacity" : ""} ${isActive ? "italic opacity-100" : `not-italic group-hover:italic ${showGlassBubble ? "opacity-0 group-hover:opacity-100" : ""}`}`}>
                {item.label}
              </span>
            </Link>
            {isActive && (
              <svg
                className="hidden lg:block grow min-w-0 h-[14px] ml-2"
                viewBox="28.84 26 599.4 13"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <line x1="28.84" y1="32.52" x2="627.02" y2="32.52" fill="none" stroke={arrowColor} strokeMiterlimit="10" strokeWidth="1.3" />
                <path d="M618.14,38.76c-.19-.3-.1-.7.2-.9l8.39-5.34-8.39-5.34c-.3-.19-.39-.6-.2-.9.19-.3.6-.39.9-.2l9.25,5.89c.19.12.3.33.3.55s-.11.43-.3.55l-9.25,5.89c-.11.07-.23.1-.35.1-.21,0-.42-.11-.55-.3Z" fill={arrowColor} />
              </svg>
            )}
          </div>
        );
      })}
    </nav>
  );
}
