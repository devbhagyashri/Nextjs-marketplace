import { Suspense } from "react";
import { Marketplace } from "@/components/marketplace";
import { getCompanies } from "@/lib/data";
import type { Company } from "@/app/types/company";

export default async function HomePage() {
  let companies: Company[] = [];
  let loadError: string | null = null;

  try {
    companies = await getCompanies();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Failed to load companies";
  }

  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading marketplace...</div>}>
      <Marketplace initialCompanies={companies} loadError={loadError} />
    </Suspense>
  );
}
