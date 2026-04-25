import Link from "next/link";
import { getProfessionalFields, getSpecialties, getPrograms, getInstitutions } from "@/lib/api";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";

export const unstable_instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const fields = await getProfessionalFields();
  const field = fields.find((f) => f.code === code);
  if (!field) return { title: "Не е намерено" };
  return { title: field.name_bg };
}

export default function ProfessionalFieldPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/professional-fields" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 mb-8 transition-colors">
          ← Всички направления
        </Link>
        <Suspense fallback={<FieldSkeleton />}>
          {params.then(({ code }) => <FieldContent code={code} />)}
        </Suspense>
      </div>

      <footer className="border-t border-slate-100 px-6 py-8 text-center text-xs text-slate-400">
        Данните са от Националния център за информация и документация. Актуализацията е автоматична.
      </footer>
    </main>
  );
}

async function FieldContent({ code }: { code: string }) {
  "use cache";
  const [fields, specialties, programs, institutions] = await Promise.all([
    getProfessionalFields(),
    getSpecialties(),
    getPrograms({ professional_field_code: code, limit: 500 }),
    getInstitutions(),
  ]);

  const field = fields.find((f) => f.code === code);
  if (!field) notFound();

  const fieldSpecialties = specialties.filter(
    (s) => s.professional_field_id === field.id
  );

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-400">{field.code}</span>
        <span className="text-xs text-slate-400">{field.area_name_bg}</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{field.name_bg}</h1>
      {field.name_en && <p className="text-slate-400 text-sm mb-10">{field.name_en}</p>}

      {fieldSpecialties.length > 0 ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Специалности</h2>
            <span className="text-xs text-slate-400 tabular-nums">{fieldSpecialties.length}</span>
          </div>
          <div className="space-y-3">
            {fieldSpecialties.map((s) => {
              const offeredBy = [
                ...new Set(
                  programs
                    .filter((p) => p.specialty_slug === s.slug)
                    .map((p) => p.institution_slug)
                ),
              ]
                .map((slug) => institutions.find((i) => i.slug === slug))
                .filter((i): i is NonNullable<typeof i> => i != null);

              return (
                <Link
                  key={s.slug}
                  href={`/specialties/${s.slug}`}
                  className="block border border-slate-100 rounded-xl p-4 hover:border-slate-200 hover:shadow-md transition-all group"
                >
                  <div className="font-medium text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {s.canonical_name_bg}
                  </div>
                  {s.canonical_name_en && (
                    <div className="text-xs text-slate-400 mt-0.5">{s.canonical_name_en}</div>
                  )}
                  {offeredBy.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {offeredBy.map((inst) => (
                        <span
                          key={inst.slug}
                          className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-md"
                        >
                          {inst.short_name_bg}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 mt-3">Няма добавени университети все още</p>
                  )}
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-slate-50 rounded-xl p-6 text-slate-400 text-sm">
          Няма специалности за това направление все още.
        </div>
      )}
    </>
  );
}

function FieldSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-5 bg-slate-100 rounded-lg w-1/4" />
      <div className="h-8 bg-slate-100 rounded-lg w-2/3" />
      <div className="space-y-3 mt-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
