import { cacheLife, cacheTag } from "next/cache";

const API_URL = process.env.API_URL ?? "http://localhost:8082";

export type Institution = {
  id: number;
  slug: string;
  name_bg: string;
  name_en: string | null;
  short_name_bg: string;
  ownership: "state" | "private" | "military" | "ecclesiastical";
  city: string;
  website_url: string | null;
  admissions_url: string | null;
  logo_url: string | null;
  founded_year: number | null;
  rsvu_rank: number | null;
  is_active: boolean;
};

export type ProfessionalField = {
  id: number;
  code: string;
  area_code: string;
  area_name_bg: string;
  name_bg: string;
  name_en: string | null;
};

export type Specialty = {
  id: number;
  slug: string;
  canonical_name_bg: string;
  canonical_name_en: string | null;
  professional_field_id: number;
};

export type Program = {
  id: number;
  slug: string;
  title_bg: string;
  title_en: string | null;
  oks_level: string;
  study_form: string;
  language: string;
  duration_semesters: number;
  tuition_bgn_per_year: string | null;
  funding: string;
  is_active: boolean;
  institution_slug: string;
  specialty_slug: string;
  professional_field_code: string;
  program_page_url: string | null;
};

export async function getInstitutions(): Promise<Institution[]> {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`${API_URL}/api/v1/institutions?page_size=100`);
  if (!res.ok) return [];
  return res.json();
}

export async function getInstitution(slug: string): Promise<Institution | null> {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`${API_URL}/api/v1/institutions/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getProfessionalFields(): Promise<ProfessionalField[]> {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`${API_URL}/api/v1/professional-fields`);
  if (!res.ok) return [];
  return res.json();
}

export async function getSpecialty(slug: string): Promise<Specialty | null> {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`${API_URL}/api/v1/specialties/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getSpecialties(): Promise<Specialty[]> {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`${API_URL}/api/v1/specialties?page_size=200`);
  if (!res.ok) return [];
  return res.json();
}

export async function getPrograms(params?: {
  institution_slug?: string;
  professional_field_code?: string;
  limit?: number;
}): Promise<Program[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("programs");
  const q = new URLSearchParams();
  if (params?.institution_slug) q.set("institution_slug", params.institution_slug);
  if (params?.professional_field_code) q.set("professional_field_code", params.professional_field_code);
  q.set("page_size", String(params?.limit ?? 50));
  const res = await fetch(`${API_URL}/api/v1/programs?${q}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.hits ?? [];
}

export async function getStats(): Promise<{
  institutions: number;
  professional_fields: number;
  specialties: number;
  programs: number;
}> {
  "use cache";
  cacheLife("hours");
  const [institutions, fields, specialties, programs] = await Promise.allSettled([
    fetch(`${API_URL}/api/v1/institutions?page_size=1`).then(r => r.headers.get("x-total-count") ?? "51"),
    fetch(`${API_URL}/api/v1/professional-fields`).then(r => r.headers.get("x-total-count") ?? "53"),
    fetch(`${API_URL}/api/v1/specialties?page_size=1`).then(r => r.headers.get("x-total-count") ?? "150"),
    fetch(`${API_URL}/api/v1/programs?page_size=1`).then(r => r.headers.get("x-total-count") ?? "0"),
  ]);
  return {
    institutions: Number(institutions.status === "fulfilled" ? institutions.value : 51),
    professional_fields: Number(fields.status === "fulfilled" ? fields.value : 53),
    specialties: Number(specialties.status === "fulfilled" ? specialties.value : 150),
    programs: Number(programs.status === "fulfilled" ? programs.value : 0),
  };
}
