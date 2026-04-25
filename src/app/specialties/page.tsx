import Link from "next/link";
import { getSpecialties, getProfessionalFields } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Специалности",
  description: "Всички акредитирани специалности в български университети.",
};

export const unstable_instant = { prefetch: "static", unstable_disableValidation: true };

export default async function SpecialtiesPage() {
  const [specialties, fields] = await Promise.all([
    getSpecialties(),
    getProfessionalFields(),
  ]);

  const fieldMap = Object.fromEntries(fields.map((f) => [f.id, f]));

  const byField = specialties.reduce<Record<string, typeof specialties>>((acc, s) => {
    const key = String(s.professional_field_id);
    (acc[key] ??= []).push(s);
    return acc;
  }, {});

  const fieldIds = Object.keys(byField).sort((a, b) => {
    const ca = parseFloat(fieldMap[Number(a)]?.code ?? "999");
    const cb = parseFloat(fieldMap[Number(b)]?.code ?? "999");
    return ca - cb;
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Специалности</h1>
        <p className="text-slate-400 text-sm mb-10">{specialties.length} специалности, групирани по направление</p>

        {fieldIds.map((fid) => {
          const field = fieldMap[Number(fid)];
          const group = byField[fid];
          return (
            <section key={fid} className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                {field && (
                  <>
                    <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">
                      {field.code}
                    </span>
                    <Link
                      href={`/professional-fields/${field.code}`}
                      className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      {field.name_bg}
                    </Link>
                  </>
                )}
                <span className="text-xs text-slate-400 tabular-nums">{group.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {group.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/specialties/${s.slug}`}
                    className="flex items-start justify-between border border-slate-100 rounded-xl p-3.5 hover:border-slate-200 hover:shadow-md transition-all group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                        {s.canonical_name_bg}
                      </div>
                      {s.canonical_name_en && (
                        <div className="text-xs text-slate-400 mt-0.5 truncate">{s.canonical_name_en}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="border-t border-slate-100 px-6 py-8 text-center text-xs text-slate-400">
        Данните са от Националния център за информация и документация. Актуализацията е автоматична.
      </footer>
    </main>
  );
}
