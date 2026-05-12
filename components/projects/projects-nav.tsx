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
  /** Optional CMS theme color — overrides the variant palette for text. */
  themeColor?: string;
  /** Optional CMS secondary color — used for the active pill background. */
  secondaryColor?: string;
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
 * Active item renders in italic serif.
 */
export function SiteNav({ activeHref, variant = "light", className, themeColor, secondaryColor }: SiteNavProps) {
  const v = variants[variant];

  // When a CMS theme color is provided, use inline styles instead of class-based colors.
  const activeStyle = themeColor ? { color: themeColor } : undefined;
  const idleStyle = themeColor ? { color: themeColor, opacity: 0.8 } : undefined;

  // Glass bubble applies on all pages that use default positioning (no className override).
  // Light variant (over dark image): dark tinted glass. Dark variant (over light bg): white-tinted glass.
  const showGlassBubble = !className;
  const glassBg = variant === "light" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.35)";
  const glassBorder = variant === "light" ? "border-white/10" : "border-black/10";

  return (
    <nav className={className ?? "absolute top-0 left-0 right-0 z-10 flex flex-col gap-2 px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] sm:px-10 sm:pt-[calc(2.5rem+env(safe-area-inset-top))] lg:px-12 lg:pt-[calc(3rem+env(safe-area-inset-top))]"}>
      {navItems.map((item) => {
        const isActive = item.href === activeHref;
        return (
          <div key={item.href} className="flex items-center gap-4 h-[30px]">
            <Link
              href={item.href}
              transitionTypes={isActive ? undefined : ["page-nav"]}
              className={`group display text-[16px] lg:text-[22px] leading-snug tracking-wide shrink-0 ${
                isActive
                  ? `font-extrabold text-cream`
                  : `font-semibold ${themeColor ? "transition-opacity hover:opacity-100" : v.idle} transition-colors`
              } ${showGlassBubble ? `relative inline-flex items-center backdrop-blur-md rounded-full px-2 py-1.5 border ${isActive ? "border-transparent" : glassBorder}` : ""}`}
              style={{
                ...(isActive ? {} : idleStyle),
                ...(showGlassBubble
                  ? isActive
                    ? { background: themeColor ?? "#7a7047" }
                    : { background: glassBg }
                  : {}),
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
          </div>
        );
      })}
    </nav>
  );
}
