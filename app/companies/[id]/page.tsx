import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyDetail } from "@/components/company-detail";
import { getCompany } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

type CompanyPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { id } = await params;
  const company = await getCompany(id).catch(() => null);
  return {
    title: company?.name ?? "Company",
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;
  const company = await getCompany(id);

  if (!company) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let alreadyInterested = false;
  if (user) {
    const { data } = await supabase
      .from("company_interests")
      .select("id")
      .eq("company_id", company.id)
      .eq("user_id", user.id)
      .maybeSingle();
    alreadyInterested = Boolean(data);
  }

  return <CompanyDetail company={company} alreadyInterested={alreadyInterested} />;
}
