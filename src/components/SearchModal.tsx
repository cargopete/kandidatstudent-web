"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import type { Institution, ProfessionalField, Specialty } from "@/lib/api";

type Props = {
  institutions: Institution[];
  fields: ProfessionalField[];
  specialties: Specialty[];
  open: boolean;
  onClose: () => void;
};

function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function hit(q: string, ...vals: (string | null | undefined)[]) {
  const nq = norm(q);
  return vals.some((v) => v && norm(v).includes(nq));
}

export default function SearchModal({
  institutions,
  fields,
  specialties,
  open,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const handleClose = useCallback(onClose, [onClose]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [handleClose]);

  const q = query.trim();
  const fieldById = new Map(fields.map((f) => [f.id, f]));

  const instResults = q
    ? institutions
        .filter((i) => hit(q, i.name_bg, i.name_en, i.short_name_bg, i.city))
        .slice(0, 5)
    : [];

  const fieldResults = q
    ? fields
        .filter((f) => hit(q, f.name_bg, f.name_en, f.code, f.area_name_bg))
        .slice(0, 5)
    : [];

  const specResults = q
    ? specialties
        .filter((s) => hit(q, s.canonical_name_bg, s.canonical_name_en))
        .slice(0, 6)
    : [];

  const hasResults =
    instResults.length > 0 || fieldResults.length > 0 || specResults.length > 0;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 px-4"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <svg
            className="w-4 h-4 text-slate-400 shrink-0"
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
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Търси университет, направление или специалност..."
            className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
          />
          <kbd className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            Esc
          </kbd>
        </div>

        {/* Body */}
        <div className="max-h-[28rem] overflow-y-auto">
          {!q && (
            <p className="px-4 py-8 text-center text-sm text-slate-400">
              Търси сред {institutions.length} университета,{" "}
              {fields.length} направления и {specialties.length} специалности
            </p>
          )}

          {q && !hasResults && (
            <p className="px-4 py-8 text-center text-sm text-slate-400">
              Няма резултати за „{q}"
            </p>
          )}

          {instResults.length > 0 && (
            <section>
              <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Университети
              </p>
              {instResults.map((i) => (
                <Link
                  key={i.slug}
                  href={`/institutions/${i.slug}`}
                  onClick={handleClose}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-xs text-slate-300 shrink-0 w-16 text-right">
                    {i.city}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {i.name_bg}
                    </p>
                    {i.name_en && (
                      <p className="text-xs text-slate-400 truncate">{i.name_en}</p>
                    )}
                  </div>
                </Link>
              ))}
            </section>
          )}

          {fieldResults.length > 0 && (
            <section>
              <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Направления
              </p>
              {fieldResults.map((f) => (
                <Link
                  key={f.code}
                  href={`/professional-fields/${f.code}`}
                  onClick={handleClose}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-xs font-mono text-slate-300 shrink-0 w-16 text-right">
                    {f.code}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {f.name_bg}
                    </p>
                    {f.name_en && (
                      <p className="text-xs text-slate-400 truncate">{f.name_en}</p>
                    )}
                  </div>
                </Link>
              ))}
            </section>
          )}

          {specResults.length > 0 && (
            <section className="pb-2">
              <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Специалности
              </p>
              {specResults.map((s) => {
                const field = fieldById.get(s.professional_field_id);
                const href = field
                  ? `/professional-fields/${field.code}`
                  : "/professional-fields";
                return (
                  <Link
                    key={s.slug}
                    href={href}
                    onClick={handleClose}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group"
                  >
                    <span className="text-xs font-mono text-slate-300 shrink-0 w-16 text-right">
                      {field?.code ?? ""}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {s.canonical_name_bg}
                      </p>
                      {s.canonical_name_en && (
                        <p className="text-xs text-slate-400 truncate">
                          {s.canonical_name_en}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
