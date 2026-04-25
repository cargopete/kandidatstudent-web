import Link from "next/link";
import { getProfessionalFields } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Професионални направления",
  description: "52 професионални направления по ПМС 125/2002.",
};

export const unstable_instant = { prefetch: "static", unstable_disableValidation: true };

export default async function ProfessionalFieldsPage() {
  const fields = await getProfessionalFields();

  const byArea = fields.reduce<Record<string, typeof fields>>((acc, f) => {
    const key = `${f.area_code} ${f.area_name_bg}`;
    (acc[key] ??= []).push(f);
    return acc;
  }, {});

  const areas = Object.keys(byArea).sort((a, b) => {
    const ca = parseFloat(a.split(" ")[0]);
    const cb = parseFloat(b.split(" ")[0]);
    return ca - cb;
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Професионални направления</h1>
        <p className="text-slate-400 text-sm mb-10">{fields.length} направления по ПМС 125/2002, групирани по области</p>

        {areas.map((area) => (
          <section key={area} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">
                {area.split(" ")[0]}
              </span>
              <h2 className="text-sm font-semibold text-slate-900">
                {area.split(" ").slice(1).join(" ")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {byArea[area].map((f) => (
                <Link
                  key={f.code}
                  href={`/professional-fields/${f.code}`}
                  className="flex items-center gap-3 border border-slate-100 rounded-xl p-3.5 hover:border-slate-200 hover:shadow-md transition-all group"
                >
                  <span className="text-xs font-mono text-slate-300 shrink-0 w-8">{f.code}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{f.name_bg}</div>
                    {f.name_en && <div className="text-xs text-slate-400 truncate">{f.name_en}</div>}
                  </div>
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
