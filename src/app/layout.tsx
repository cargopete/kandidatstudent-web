import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { getInstitutions, getProfessionalFields, getSpecialties } from "@/lib/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "kandidatstudent.com",
    template: "%s · kandidatstudent.com",
  },
  description:
    "Всички акредитирани специалности в 51 български университета на едно място.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [institutions, fields, specialties] = await Promise.all([
    getInstitutions(),
    getProfessionalFields(),
    getSpecialties(),
  ]);

  return (
    <html
      lang="bg"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav institutions={institutions} fields={fields} specialties={specialties} />
        {children}
      </body>
    </html>
  );
}
