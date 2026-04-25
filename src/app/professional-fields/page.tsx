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
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 text-lg">кандидат-студент.бг</Link>
        <div className="flex gap-6 text-sm text-gray-600">
          <Link href="/institutions" className="hover:text-gray-900">Университети</Link>
          <Link href="/professional-fields" className="text-gray-900 font-medium">Направления</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Професионални направления</h1>
        <p className="text-gray-500 mb-10">{fields.length} направления по ПМС 125/2002, групирани по области</p>

        {areas.map((area) => (
          <section key={area} className="mb-8">
            <h2 className="text-base font-semibold text-gray-500 mb-3 flex items-center gap-2">
              <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                {area.split(" ")[0]}
              </span>
              {area.split(" ").slice(1).join(" ")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {byArea[area].map((f) => (
                <Link
                  key={f.code}
                  href={`/professional-fields/${f.code}`}
                  className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xs font-mono text-gray-400 shrink-0 w-8">{f.code}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{f.name_bg}</div>
                    {f.name_en && <div className="text-xs text-gray-400">{f.name_en}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        Данните са от НАЦИД. Актуализацията е автоматична.
      </footer>
    </main>
  );
}
