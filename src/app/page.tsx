import Link from "next/link";
import { getInstitutions, getProfessionalFields } from "@/lib/api";

export const unstable_instant = { prefetch: "static", unstable_disableValidation: true };

export default async function Home() {
  const [institutions, fields] = await Promise.all([
    getInstitutions(),
    getProfessionalFields(),
  ]);

  const stateCount = institutions.filter((i) => i.ownership === "state").length;
  const privateCount = institutions.filter((i) => i.ownership === "private").length;
  const militaryCount = institutions.filter((i) => i.ownership === "military").length;

  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full mb-8">
          {institutions.length} акредитирани университета
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
          Намери своята специалност
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
          Всички акредитирани програми в България — на едно място.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/institutions"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors text-sm"
          >
            Разгледай университетите
          </Link>
          <Link
            href="/professional-fields"
            className="px-5 py-2.5 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors text-sm"
          >
            По направление →
          </Link>
        </div>
      </section>

      <section className="py-10 px-6 border-y border-slate-100">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-slate-100 text-center">
          <div className="px-6 py-2">
            <div className="text-3xl font-bold text-slate-900 tabular-nums">{institutions.length}</div>
            <div className="text-sm text-slate-400 mt-1">университета</div>
          </div>
          <div className="px-6 py-2">
            <div className="text-3xl font-bold text-slate-900 tabular-nums">{fields.length}</div>
            <div className="text-sm text-slate-400 mt-1">направления</div>
          </div>
          <div className="px-6 py-2">
            <div className="text-3xl font-bold text-slate-900 tabular-nums">52</div>
            <div className="text-sm text-slate-400 mt-1">области</div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-slate-50 rounded-xl p-5">
            <div className="text-4xl font-bold text-slate-900 tabular-nums">{stateCount}</div>
            <div className="text-sm text-slate-500 mt-1">Държавни</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-5">
            <div className="text-4xl font-bold text-slate-900 tabular-nums">{privateCount}</div>
            <div className="text-sm text-slate-500 mt-1">Частни</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-5">
            <div className="text-4xl font-bold text-slate-900 tabular-nums">{militaryCount}</div>
            <div className="text-sm text-slate-500 mt-1">Военни</div>
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">Университети</h2>
          <Link href="/institutions" className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors">
            Всички {institutions.length} →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {institutions.slice(0, 12).map((inst) => (
            <Link
              key={inst.slug}
              href={`/institutions/${inst.slug}`}
              className="block border border-slate-100 rounded-xl p-4 hover:border-slate-200 hover:shadow-md transition-all group"
            >
              <div className="font-medium text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                {inst.short_name_bg}
              </div>
              <div className="text-xs text-slate-400 mt-1">{inst.city}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 border-t border-slate-100 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-base font-semibold text-slate-900">Професионални направления</h2>
            <Link href="/professional-fields" className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors">
              Всички {fields.length} →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {fields.slice(0, 18).map((f) => (
              <Link
                key={f.code}
                href={`/professional-fields/${f.code}`}
                className="flex items-start gap-2.5 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all group"
              >
                <span className="text-xs font-mono text-slate-300 mt-0.5 shrink-0">{f.code}</span>
                <span className="text-sm text-slate-600 leading-tight group-hover:text-slate-900 transition-colors">{f.name_bg}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 px-6 py-8 text-center text-xs text-slate-400">
        Данните са от Националния център за информация и документация. Актуализацията е автоматична.
      </footer>
    </main>
  );
}
