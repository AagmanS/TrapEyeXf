"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "HOME",       path: "/" },
  { label: "SCANNER",    path: "/scanner" },
  { label: "FAKE NEWS",  path: "/fakenews" },
  { label: "DEEPFAKE",   path: "/deepfake" },
  { label: "SANDBOX",    path: "/sandbox" },
  { label: "DASHBOARD",  path: "/dashboard" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background:       scrolled ? "rgba(10,10,10,0.88)" : "transparent",
        backdropFilter:   scrolled ? "blur(14px)"          : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)"      : "none",
        borderBottom:     scrolled ? "1px solid #1E1E1E"   : "1px solid transparent",
      }}
    >
      <div className="flex items-center justify-between h-[60px] px-6 md:px-[48px] max-w-[1400px] mx-auto">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-[10px] shrink-0 group">
          <span className="w-[10px] h-[10px] bg-[#8bfb25] group-hover:scale-110 transition-transform shadow-[0_0_8px_#8bfb25]" />
          <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
            TRAPEYE
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-[36px]">
          {links.map(({ label, path }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={label}
                href={path}
                className="relative font-ibm-mono text-[10px] tracking-[1.5px] transition-colors duration-150"
                style={{ color: isActive ? "#8bfb25" : "#888" }}
              >
                {label}
                <span
                  className="absolute left-0 -bottom-[5px] h-[1.5px] bg-[#8bfb25] transition-all duration-300"
                  style={{ width: isActive ? "100%" : "0%" }}
                />
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:flex items-center gap-[14px]">
          <Link
            href="/dashboard"
            className="font-grotesk text-[11px] font-bold text-[#0A0A0A] bg-[#8bfb25] tracking-[1.5px] px-[18px] py-[9px] hover:bg-[#F5F5F0] transition-colors shadow-[0_0_10px_#8bfb25]"
          >
            OPEN DASHBOARD
          </Link>
        </div>

        {/* ── Mobile burger ── */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-[20px] h-[1.5px] bg-[#F5F5F0] transition-transform duration-200 origin-center"
            style={{ transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none" }}
          />
          <span
            className="block w-[20px] h-[1.5px] bg-[#F5F5F0] transition-opacity duration-200"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-[20px] h-[1.5px] bg-[#F5F5F0] transition-transform duration-200 origin-center"
            style={{ transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }}
          />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight:    menuOpen ? "400px" : "0px",
          background:   "rgba(10,10,10,0.97)",
          backdropFilter: "blur(14px)",
          borderBottom: menuOpen ? "1px solid #1E1E1E" : "none",
        }}
      >
        <nav className="flex flex-col px-6 py-5 gap-0">
          {links.map(({ label, path }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={label}
                href={path}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 w-full font-ibm-mono text-[12px] tracking-[2px] py-[14px] border-b border-[#141414] transition-colors bg-transparent border-x-0 border-t-0 cursor-pointer"
                style={{ color: isActive ? "#8bfb25" : "#888" }}
              >
                <span
                  className="w-[4px] h-[4px] rounded-full shrink-0 transition-colors"
                  style={{ background: isActive ? "#8bfb25" : "#2D2D2D" }}
                />
                {label}
              </Link>
            );
          })}
          <div className="flex flex-col gap-[10px] pt-5">
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="font-grotesk text-[11px] font-bold text-[#0A0A0A] bg-[#8bfb25] tracking-[1.5px] px-[18px] py-[11px] text-center hover:bg-[#F5F5F0] transition-colors"
            >
              OPEN DASHBOARD
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
