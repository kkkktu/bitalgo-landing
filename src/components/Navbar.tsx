"use client";

import { useState } from "react";
import { navLinks } from "@/lib/data";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <Logo />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="text-sm font-medium text-slate-600 hover:text-blue-600">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Log in
          </a>
          <a
            href="#"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Get API key
          </a>
        </div>

        <button
          className="rounded-md p-2 text-slate-600 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              {l.label}
            </a>
          ))}
          <a href="#" className="mt-2 block rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white">
            Get API key
          </a>
        </div>
      )}
    </header>
  );
}
