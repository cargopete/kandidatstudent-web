import Link from "next/link";
import { getProfessionalFields, getSpecialties } from "@/lib/api";
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
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 text-lg">kandidatstudent.com</Link>
        <div className="flex gap-6 text-sm text-gray-600">
          <Link href="/institutions" className="hover:text-gray-900">Университети</Link>
          <Link href="/professional-fields" className="hover:text-gray-900">Направления</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/professional-fields" className="text-sm text-gray-400 hover:text-gray-700 mb-6 block">
          ← Всички направления
        </Link>
        <Suspense fallback={<FieldSkeleton />}>
          {params.then(({ code }) => <FieldContent code={code} />)}
        </Suspense>
      </div>

      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        Данните са от НАЦИД. Актуализацията е автоматична.
      </footer>
    </main>
  );
}

async function FieldContent({ code }: { code: string }) {
  "use cache";
  const [fields, specialties] = await Promise.all([
    getProfessionalFields(),
    getSpecialties(),
  ]);

  const field = fields.find((f) => f.code === code);
  if (!field) notFound();

  const fieldSpecialties = specialties.filter(
    (s) => s.professional_field_id === field.id
  );

  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">{field.code}</span>
        <span className="text-xs text-gray-400">{field.area_name_bg}</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">{field.name_bg}</h1>
      {field.name_en && <p className="text-gray-400 mb-8">{field.name_en}</p>}

      {fieldSpecialties.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Специалности ({fieldSpecialties.length})
          </h2>
          <div className="space-y-2">
            {fieldSpecialties.map((s) => (
              <div key={s.slug} className="border border-gray-200 rounded-lg p-4">
                <div className="font-medium text-gray-900">{s.canonical_name_bg}</div>
                {s.canonical_name_en && (
                  <div className="text-sm text-gray-400">{s.canonical_name_en}</div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-gray-500 text-sm">
          Няма специалности за това направление все още.
        </div>
      )}
    </>
  );
}

function FieldSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-100 rounded w-1/4" />
      <div className="h-8 bg-gray-100 rounded w-2/3" />
      <div className="space-y-3 mt-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
