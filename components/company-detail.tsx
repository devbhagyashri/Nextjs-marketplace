import Image from "next/image";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExpressInterestButton } from "@/components/express-interest-button";
import { formatDate, formatPrice } from "@/lib/format";
import type { Company } from "@/app/types/company";

type CompanyDetailProps = {
  company: Company;
  alreadyInterested: boolean;
};

export function CompanyDetail({ company, alreadyInterested }: CompanyDetailProps) {
  return (
    <article className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="overflow-hidden rounded-2xl border bg-muted">
        {company.image_url ? (
          <div className="relative h-[320px] w-full">
            <Image
              src={company.image_url}
              alt={company.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="flex h-[320px] items-center justify-center text-muted-foreground">
            <Building2 className="h-16 w-16" />
          </div>
        )}
      </div>

      <div className="space-y-5">
        <Badge>{company.industry}</Badge>
        <h1 className="text-3xl font-bold">{company.name}</h1>
        <p className="text-3xl font-semibold text-emerald-600">{formatPrice(company.price)}</p>
        <p className="text-muted-foreground">{company.description || "No description provided."}</p>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4 border-b py-2">
            <dt className="text-muted-foreground">Seller</dt>
            <dd>{company.seller_email || "Hidden"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-2">
            <dt className="text-muted-foreground">Buyer interest</dt>
            <dd>{company.interest_count ?? 0}</dd>
          </div>
          {company.created_at && (
            <div className="flex justify-between gap-4 border-b py-2">
              <dt className="text-muted-foreground">Listed</dt>
              <dd>{formatDate(company.created_at)}</dd>
            </div>
          )}
        </dl>
        <ExpressInterestButton
          companyId={company.id}
          sellerId={company.seller_id}
          alreadyInterested={alreadyInterested}
        />
        <Button asChild variant="outline" className="w-full">
          <Link href="/">Back to marketplace</Link>
        </Button>
      </div>
    </article>
  );
}
