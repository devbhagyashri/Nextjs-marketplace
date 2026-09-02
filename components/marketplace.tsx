"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Building2 } from "lucide-react";
import { CompanyCard } from "@/components/company-card";
import { CompanyFilters } from "@/components/company-filters";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import type { Company } from "@/app/types/company";

type MarketplaceProps = {
  initialCompanies: Company[];
  loadError?: string | null;
};

export function Marketplace({ initialCompanies, loadError }: MarketplaceProps) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [interestedIds, setInterestedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setInterestedIds(new Set());
      return;
    }

    const supabase = createClient();
    supabase
      .from("company_interests")
      .select("company_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setInterestedIds(new Set((data ?? []).map((row) => row.company_id)));
      });
  }, [user]);

  const filteredCompanies = useMemo(() => {
    return initialCompanies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase());
      const matchesIndustry = industry ? company.industry === industry : true;
      const matchesMin = minPrice ? company.price >= parseFloat(minPrice) : true;
      const matchesMax = maxPrice ? company.price <= parseFloat(maxPrice) : true;
      return matchesSearch && matchesIndustry && matchesMin && matchesMax;
    });
  }, [initialCompanies, search, industry, minPrice, maxPrice]);

  const totalAsking = initialCompanies.reduce((sum, company) => sum + Number(company.price || 0), 0);

  return (
    <div className="space-y-8">
      {searchParams.get("auth") === "required" && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Sign in with Google to access that page.
        </p>
      )}
      {searchParams.get("error") === "auth" && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Google sign-in failed. Check that the Google provider is enabled in Supabase.
        </p>
      )}
      {loadError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load listings. Run <code>supabase/schema.sql</code> in your project, then refresh.
          {loadError ? ` (${loadError})` : ""}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border bg-gradient-to-br from-teal-50 via-white to-slate-50 px-6 py-12 sm:px-10">
        <p className="text-sm font-medium text-teal-700">Company acquisitions</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Buy and sell companies in one marketplace
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Browse live listings, express interest as a buyer, and manage the companies you want to sell.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white/80 p-4">
            <p className="text-2xl font-semibold">{initialCompanies.length}</p>
            <p className="text-sm text-muted-foreground">Active listings</p>
          </div>
          <div className="rounded-xl border bg-white/80 p-4">
            <p className="text-2xl font-semibold">{formatPrice(totalAsking)}</p>
            <p className="text-sm text-muted-foreground">Total asking value</p>
          </div>
          <div className="rounded-xl border bg-white/80 p-4">
            <p className="text-2xl font-semibold">
              {new Set(initialCompanies.map((company) => company.industry)).size}
            </p>
            <p className="text-sm text-muted-foreground">Industries</p>
          </div>
        </div>
      </section>

      <CompanyFilters
        search={search}
        industry={industry}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onSearchChange={setSearch}
        onIndustryChange={setIndustry}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onReset={() => {
          setSearch("");
          setIndustry("");
          setMinPrice("");
          setMaxPrice("");
        }}
      />

      {filteredCompanies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={initialCompanies.length === 0 ? "No companies listed yet" : "No matching companies"}
          description={
            initialCompanies.length === 0
              ? "Be the first to list a company for sale."
              : "Try a different search or clear the filters."
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              interested={interestedIds.has(company.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
