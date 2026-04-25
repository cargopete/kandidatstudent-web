import Link from "next/link";
import { getInstitutions } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Университети",
  description: "Всички акредитирани висши училища в България.",
};

export const unstable_instant = { prefetch: "static", unstable_disableValidation: true };

const OWNERSHIP_LABELS: Record<string, string> = {
  state: "Държавен",
  private: "Частен",
  military: "Военен",
  ecclesiastical: "Духовен",
};

const OWNERSHIP_COLORS: Record<string, string> = {
  state: "bg-blue-50 text-blue-600",
  private: "bg-amber-50 text-amber-600",
  military: "bg-slate-100 text-slate-500",
  ecclesiastical: "bg-purple-50 text-purple-600",
};

export default async function InstitutionsPage() {
  const institutions = await getInstitutions();

  const byCity = institutions.reduce<Record<string, typeof institutions>>(
    (acc, inst) => {
      (acc[inst.city] ??= []).push(inst);
      return acc;
    },
    {}
  );

  const cities = Object.keys(byCity).sort((a, b) =>
    byCity[b].length - byCity[a].length
  );

  return (
    <main className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-slate-900 tracking-tight">kandidatstudent.com</Link>
        <div className="flex gap-1 text-sm">
          <Link href="/institutions" className="px-3 py-1.5 rounded-md text-slate-900 font-medium bg-slate-50">Университети</Link>
          <Link href="/professional-fields" className="px-3 py-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">Направления</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Университети</h1>
        <p className="text-slate-400 mb-10 text-sm">{institutions.length} акредитирани висши училища</p>

        {cities.map((city) => (
          <section key={city} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold text-slate-900">{city}</h2>
              <span className="text-xs text-slate-400 tabular-nums">{byCity[city].length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {byCity[city].map((inst) => (
                <Link
                  key={inst.slug}
                  href={`/institutions/${inst.slug}`}
                  className="flex items-start justify-between border border-slate-100 rounded-xl p-4 hover:border-slate-200 hover:shadow-md transition-all group"
                >
                  <div className="min-w-0 mr-3">
                    <div className="font-medium text-slate-900 leading-tight text-sm group-hover:text-indigo-600 transition-colors">
                      {inst.name_bg}
                    </div>
                    {inst.name_en && (
                      <div className="text-xs text-slate-400 mt-0.5 truncate">{inst.name_en}</div>
                    )}
                  </div>
                  <span className={`shrink-0 text-xs rounded-md px-2 py-0.5 font-medium ${OWNERSHIP_COLORS[inst.ownership] ?? "bg-slate-100 text-slate-500"}`}>
                    {OWNERSHIP_LABELS[inst.ownership] ?? inst.ownership}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="border-t border-slate-100 px-6 py-8 text-center text-xs text-slate-400">
        Данните са от Националния център за информация и документация. Актуализацията е автоматична.
      </footer>
    </main>
  );
}
