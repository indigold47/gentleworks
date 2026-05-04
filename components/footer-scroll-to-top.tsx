"use client";

export function FooterScrollToTop({ color }: { color: string }) {
  return (
    <button
      type="button"
      aria-label="Scroll to top"
      className="group cursor-pointer"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <span
        className="block h-[16px] w-[16px] transition-transform duration-300 ease-out group-hover:-translate-y-1"
        style={{
          backgroundColor: color,
          maskImage: "url('/assets/up-arrow.svg')",
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskImage: "url('/assets/up-arrow.svg')",
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
        }}
      />
    </button>
  );
}
