"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import type { Company } from "@/app/types/company";

type MyListingsProps = {
  initialCompanies: Company[];
};

export function MyListings({ initialCompanies }: MyListingsProps) {
  const router = useRouter();
  const [companies, setCompanies] = useState(initialCompanies);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(company: Company) {
    if (!window.confirm(`Delete ${company.name}? This cannot be undone.`)) {
      return;
    }

    setDeletingId(company.id);
    setError("");
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("companies").delete().eq("id", company.id);

    setDeletingId(null);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setCompanies((current) => current.filter((item) => item.id !== company.id));
    router.refresh();
  }

  if (companies.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="You have no listings yet"
        description="Create a listing to start receiving buyer interest."
        actionLabel="Sell a company"
        onAction={() => router.push("/sell")}
      />
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {companies.map((company) => (
        <Card key={company.id}>
          <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/companies/${company.id}`} className="font-semibold hover:underline">
                  {company.name}
                </Link>
                <Badge>{company.industry}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatPrice(company.price)} · {company.interest_count ?? 0} interested buyers
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/companies/${company.id}`}>View</Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(company)}
                disabled={deletingId === company.id}
              >
                <Trash2 />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
