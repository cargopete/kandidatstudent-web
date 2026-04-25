import Link from "next/link";
import { getInstitutions } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Университети",
  description: "Всички акредитирани висши училища в България.",
};

export const unstable_instant = { prefetch: "static" };

const OWNERSHIP_LABELS: Record<string, string> = {
  state: "Държавен",
  private: "Частен",
  military: "Военен",
  ecclesiastical: "Духовен",
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
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 text-lg">кандидат-студент.бг</Link>
        <div className="flex gap-6 text-sm text-gray-600">
          <Link href="/institutions" className="text-gray-900 font-medium">Университети</Link>
          <Link href="/professional-fields" className="hover:text-gray-900">Направления</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Университети</h1>
        <p className="text-gray-500 mb-10">{institutions.length} акредитирани висши училища</p>

        {cities.map((city) => (
          <section key={city} className="mb-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b border-gray-100 pb-2">
              {city}
              <span className="ml-2 text-sm font-normal text-gray-400">{byCity[city].length}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {byCity[city].map((inst) => (
                <Link
                  key={inst.slug}
                  href={`/institutions/${inst.slug}`}
                  className="flex items-start justify-between border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:bg-gray-50 transition-colors group"
                >
                  <div>
                    <div className="font-medium text-gray-900 leading-tight group-hover:text-black">
                      {inst.name_bg}
                    </div>
                    {inst.name_en && (
                      <div className="text-xs text-gray-400 mt-0.5">{inst.name_en}</div>
                    )}
                  </div>
                  <span className="ml-3 shrink-0 text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
                    {OWNERSHIP_LABELS[inst.ownership] ?? inst.ownership}
                  </span>
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
