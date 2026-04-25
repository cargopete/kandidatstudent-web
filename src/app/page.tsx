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
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-gray-900 text-lg">kandidatstudent.com</span>
        <div className="flex gap-6 text-sm text-gray-600">
          <Link href="/institutions" className="hover:text-gray-900">Университети</Link>
          <Link href="/professional-fields" className="hover:text-gray-900">Направления</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Намери своята специалност
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Всички акредитирани програми в {institutions.length} български университета — на едно място.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/institutions"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Разгледай университетите
          </Link>
          <Link
            href="/professional-fields"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-500 transition-colors"
          >
            По направление
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-b border-gray-100 bg-gray-50 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900">{institutions.length}</div>
            <div className="text-sm text-gray-500 mt-1">университета</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{fields.length}</div>
            <div className="text-sm text-gray-500 mt-1">направления</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">52</div>
            <div className="text-sm text-gray-500 mt-1">области</div>
          </div>
        </div>
      </section>

      {/* Institutions by ownership */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Университети по тип</h2>
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="text-4xl font-bold text-gray-900">{stateCount}</div>
            <div className="text-gray-600 mt-1">Държавни</div>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="text-4xl font-bold text-gray-900">{privateCount}</div>
            <div className="text-gray-600 mt-1">Частни</div>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="text-4xl font-bold text-gray-900">{militaryCount}</div>
            <div className="text-gray-600 mt-1">Военни</div>
          </div>
        </div>

        {/* Institution grid — top 12 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {institutions.slice(0, 12).map((inst) => (
            <Link
              key={inst.slug}
              href={`/institutions/${inst.slug}`}
              className="block border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900 text-sm leading-tight">
                {inst.short_name_bg}
              </div>
              <div className="text-xs text-gray-400 mt-1">{inst.city}</div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/institutions" className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2">
            Всички {institutions.length} университета →
          </Link>
        </div>
      </section>

      {/* Professional fields */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Професионални направления</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {fields.slice(0, 18).map((f) => (
              <Link
                key={f.code}
                href={`/professional-fields/${f.code}`}
                className="flex items-start gap-2 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all"
              >
                <span className="text-xs font-mono text-gray-400 mt-0.5 shrink-0">{f.code}</span>
                <span className="text-sm text-gray-700 leading-tight">{f.name_bg}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/professional-fields" className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2">
              Всички {fields.length} направления →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        Данните са от НАЦИД. Актуализацията е автоматична.
      </footer>
    </main>
  );
}
