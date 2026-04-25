import Link from "next/link";
import { getInstitution } from "@/lib/api";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";

export const unstable_instant = { prefetch: "static" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const inst = await getInstitution(slug);
  if (!inst) return { title: "Не е намерено" };
  return {
    title: inst.short_name_bg,
    description: inst.name_en ?? inst.name_bg,
  };
}

export default function InstitutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 text-lg">кандидат-студент.бг</Link>
        <div className="flex gap-6 text-sm text-gray-600">
          <Link href="/institutions" className="hover:text-gray-900">Университети</Link>
          <Link href="/professional-fields" className="hover:text-gray-900">Направления</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/institutions" className="text-sm text-gray-400 hover:text-gray-700 mb-6 block">
          ← Всички университети
        </Link>
        <Suspense fallback={<InstitutionSkeleton />}>
          {params.then(({ slug }) => <InstitutionContent slug={slug} />)}
        </Suspense>
      </div>

      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        Данните са от НАЦИД. Актуализацията е автоматична.
      </footer>
    </main>
  );
}

async function InstitutionContent({ slug }: { slug: string }) {
  "use cache";
  const inst = await getInstitution(slug);
  if (!inst) notFound();

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-1">
        {inst.name_bg}
      </h1>
      {inst.name_en && <p className="text-gray-400 mb-6">{inst.name_en}</p>}

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Град</div>
          <div className="font-medium text-gray-900">{inst.city}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Тип</div>
          <div className="font-medium text-gray-900 capitalize">{inst.ownership}</div>
        </div>
        {inst.website_url && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Сайт</div>
            <a
              href={inst.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline text-sm break-all"
            >
              {inst.website_url.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
        {inst.admissions_url && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Прием</div>
            <a
              href={inst.admissions_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline text-sm"
            >
              Към страницата за кандидатстване →
            </a>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        Програмите за този университет ще бъдат добавени скоро.
      </div>
    </>
  );
}

function InstitutionSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-100 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
      <div className="grid grid-cols-2 gap-4 mt-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
