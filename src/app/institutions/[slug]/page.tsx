import Link from "next/link";
import { getInstitution } from "@/lib/api";
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
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-slate-900 tracking-tight">kandidatstudent.com</Link>
        <div className="flex gap-1 text-sm">
          <Link href="/institutions" className="px-3 py-1.5 rounded-md text-slate-900 font-medium bg-slate-50">Университети</Link>
          <Link href="/professional-fields" className="px-3 py-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">Направления</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/institutions" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 mb-8 transition-colors">
          ← Всички университети
        </Link>
        <Suspense fallback={<InstitutionSkeleton />}>
          {params.then(({ slug }) => <InstitutionContent slug={slug} />)}
        </Suspense>
      </div>

      <footer className="border-t border-slate-100 px-6 py-8 text-center text-xs text-slate-400">
        Данните са от Националния център за информация и документация. Актуализацията е автоматична.
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
      <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight mb-1">
        {inst.name_bg}
      </h1>
      {inst.name_en && <p className="text-slate-400 text-sm mb-8">{inst.name_en}</p>}

      <div className="grid grid-cols-2 gap-3 mb-10">
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Град</div>
          <div className="font-medium text-slate-900 text-sm">{inst.city}</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Тип</div>
          <div className="font-medium text-slate-900 text-sm capitalize">{inst.ownership}</div>
        </div>
        {inst.website_url && (
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Сайт</div>
            <a
              href={inst.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:text-indigo-500 text-sm break-all transition-colors"
            >
              {inst.website_url.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
        {inst.admissions_url && (
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Прием</div>
            <a
              href={inst.admissions_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:text-indigo-500 text-sm transition-colors"
            >
              Към страницата за кандидатстване →
            </a>
          </div>
        )}
      </div>

      <div className="border border-amber-100 bg-amber-50 rounded-xl p-4 text-sm text-amber-700">
        Програмите за този университет ще бъдат добавени скоро.
      </div>
    </>
  );
}

function InstitutionSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-slate-100 rounded-lg w-3/4" />
      <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
      <div className="grid grid-cols-2 gap-3 mt-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
