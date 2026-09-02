import { createClient } from "@/lib/supabase/server";
import type { Company, CompanyInterest } from "@/app/types/company";

type CompanyRow = Company & {
  company_interests?: { count: number }[] | null;
};

function mapCompany(row: CompanyRow): Company {
  return {
    ...row,
    interest_count: row.company_interests?.[0]?.count ?? 0,
  };
}

export async function getCompanies(): Promise<Company[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*, company_interests(count)")
    .order("created_at", { ascending: false });

  if (!error) {
    return (data ?? []).map((row) => mapCompany(row as CompanyRow));
  }

  const fallback = await supabase.from("companies").select("*");
  if (fallback.error) {
    throw new Error(fallback.error.message);
  }

  return (fallback.data ?? []) as Company[];
}

export async function getCompany(id: string): Promise<Company | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*, company_interests(count)")
    .eq("id", id)
    .maybeSingle();

  if (!error) {
    return data ? mapCompany(data as CompanyRow) : null;
  }

  const fallback = await supabase.from("companies").select("*").eq("id", id).maybeSingle();
  if (fallback.error) {
    throw new Error(fallback.error.message);
  }

  return (fallback.data as Company | null) ?? null;
}

export async function getMyCompanies(): Promise<Company[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("companies")
    .select("*, company_interests(count)")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  if (!error) {
    return (data ?? []).map((row) => mapCompany(row as CompanyRow));
  }

  const fallback = await supabase.from("companies").select("*").eq("seller_id", user.id);
  if (fallback.error) {
    throw new Error(fallback.error.message);
  }

  return (fallback.data ?? []) as Company[];
}

export async function getSellerInterests(): Promise<CompanyInterest[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: listings, error: listingsError } = await supabase
    .from("companies")
    .select("id, name")
    .eq("seller_id", user.id);

  if (listingsError) {
    throw new Error(listingsError.message);
  }

  const listingIds = (listings ?? []).map((listing) => listing.id);
  if (listingIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("company_interests")
    .select("id, created_at, company_id, user_id, buyer_email")
    .in("company_id", listingIds)
    .order("created_at", { ascending: false });

  if (error) {
    const fallback = await supabase
      .from("company_interests")
      .select("id, created_at, company_id, user_id")
      .in("company_id", listingIds);

    if (fallback.error) {
      throw new Error(fallback.error.message);
    }

    return (fallback.data ?? []).map((interest) => ({
      ...interest,
      company_name: listings?.find((listing) => listing.id === interest.company_id)?.name,
    }));
  }

  return (data ?? []).map((interest) => ({
    ...interest,
    company_name: listings?.find((listing) => listing.id === interest.company_id)?.name,
  }));
}
