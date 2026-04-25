import Link from "next/link";
import { getSpecialty, getProfessionalFields, getPrograms, getInstitutions } from "@/lib/api";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";

export const unstable_instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const specialty = await getSpecialty(slug);
  if (!specialty) return { title: "Не е намерено" };
  return {
    title: specialty.canonical_name_bg,
    description: specialty.canonical_name_en ?? undefined,
  };
}

export default function SpecialtyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Suspense fallback={<SpecialtySkeleton />}>
          {params.then(({ slug }) => <SpecialtyContent slug={slug} />)}
        </Suspense>
      </div>

      <footer className="border-t border-slate-100 px-6 py-8 text-center text-xs text-slate-400">
        Данните са от Националния център за информация и документация. Актуализацията е автоматична.
      </footer>
    </main>
  );
}

const OKS_LABELS: Record<string, string> = {
  bachelor: "Бакалавър",
  master: "Магистър",
  doctor: "Доктор",
  professional_bachelor: "Проф. бакалавър",
};

const FORM_LABELS: Record<string, string> = {
  full_time: "Редовно",
  part_time: "Задочно",
  distance: "Дистанционно",
  evening: "Вечерно",
};

async function SpecialtyContent({ slug }: { slug: string }) {
  "use cache";
  const [specialty, fields, institutions] = await Promise.all([
    getSpecialty(slug),
    getProfessionalFields(),
    getInstitutions(),
  ]);

  if (!specialty) notFound();

  const field = fields.find((f) => f.id === specialty.professional_field_id);

  // Fetch programs for the whole professional field, then filter by specialty
  const programs = field
    ? await getPrograms({ professional_field_code: field.code, limit: 500 })
    : [];

  const specialtyPrograms = programs.filter((p) => p.specialty_slug === slug);

  // Group programs by institution
  const byInstitution = specialtyPrograms.reduce<
    Record<string, typeof specialtyPrograms>
  >((acc, p) => {
    (acc[p.institution_slug] ??= []).push(p);
    return acc;
  }, {});

  const institutionSlugs = Object.keys(byInstitution);

  return (
    <>
      {field && (
        <Link
          href={`/professional-fields/${field.code}`}
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 mb-8 transition-colors"
        >
          ← {field.name_bg}
        </Link>
      )}

      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
        {specialty.canonical_name_bg}
      </h1>
      {specialty.canonical_name_en && (
        <p className="text-slate-400 text-sm mb-2">{specialty.canonical_name_en}</p>
      )}
      {field && (
        <div className="flex items-center gap-2 mb-10">
          <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-400">
            {field.code}
          </span>
          <span className="text-xs text-slate-400">{field.name_bg}</span>
        </div>
      )}

      {institutionSlugs.length > 0 ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Университети, предлагащи тази специалност
            </h2>
            <span className="text-xs text-slate-400 tabular-nums">
              {institutionSlugs.length}
            </span>
          </div>
          <div className="space-y-4">
            {institutionSlugs.map((instSlug) => {
              const inst = institutions.find((i) => i.slug === instSlug);
              const instPrograms = byInstitution[instSlug];
              return (
                <div key={instSlug} className="border border-slate-100 rounded-xl overflow-hidden">
                  <Link
                    href={`/institutions/${instSlug}`}
                    className="flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors group"
                  >
                    <div>
                      <span className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {inst?.name_bg ?? instSlug}
                      </span>
                      {inst?.city && (
                        <span className="ml-2 text-xs text-slate-400">{inst.city}</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">→</span>
                  </Link>
                  <div className="divide-y divide-slate-50">
                    {instPrograms.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between px-4 py-3 gap-4"
                      >
                        <div className="text-sm text-slate-700">{p.title_bg}</div>
                        <div className="shrink-0 flex items-center gap-2 text-xs text-slate-400">
                          <span className="bg-slate-50 px-2 py-0.5 rounded-md">
                            {OKS_LABELS[p.oks_level] ?? p.oks_level}
                          </span>
                          <span>{FORM_LABELS[p.study_form] ?? p.study_form}</span>
                          {p.tuition_bgn_per_year && (
                            <span className="font-medium text-slate-600">
                              {Number(p.tuition_bgn_per_year).toLocaleString("bg-BG")} лв.
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="border border-slate-100 rounded-xl p-6 text-slate-400 text-sm">
          Няма добавени университети за тази специалност все още.
        </div>
      )}
    </>
  );
}

function SpecialtySkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-slate-100 rounded w-32" />
      <div className="h-8 bg-slate-100 rounded-lg w-2/3" />
      <div className="h-4 bg-slate-100 rounded w-1/3" />
      <div className="space-y-3 mt-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
