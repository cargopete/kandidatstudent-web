"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchModal from "./SearchModal";
import type { Institution, ProfessionalField, Specialty } from "@/lib/api";

type Props = {
  institutions: Institution[];
  fields: ProfessionalField[];
  specialties: Specialty[];
};

export default function Nav({ institutions, fields, specialties }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const active = (path: string) =>
    pathname === path || pathname.startsWith(path + "/")
      ? "text-indigo-700 font-medium bg-indigo-100"
      : "text-indigo-500 hover:text-indigo-800 hover:bg-indigo-100";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-indigo-50/90 backdrop-blur-sm border-b border-indigo-100 px-6 py-3 flex items-center gap-3">
        <Link
          href="/"
          className="font-semibold text-indigo-900 tracking-tight mr-1 shrink-0"
        >
          kandidatstudent.com
        </Link>

        <div className="flex gap-1 text-sm shrink-0">
          <Link
            href="/institutions"
            className={`px-3 py-1.5 rounded-md transition-colors ${active("/institutions")}`}
          >
            Университети
          </Link>
          <Link
            href="/professional-fields"
            className={`px-3 py-1.5 rounded-md transition-colors ${active("/professional-fields")}`}
          >
            Направления
          </Link>
        </div>

        <button
          onClick={openSearch}
          className="ml-auto flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-400 bg-white/70 hover:bg-white border border-indigo-200 rounded-lg transition-colors"
        >
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="hidden sm:inline">Търси...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[11px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 leading-none">
            ⌘K
          </kbd>
        </button>
      </nav>

      <SearchModal
        institutions={institutions}
        fields={fields}
        specialties={specialties}
        open={open}
        onClose={closeSearch}
      />
    </>
  );
}
