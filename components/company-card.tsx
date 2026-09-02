import Image from "next/image";
import Link from "next/link";
import { Building2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExpressInterestButton } from "@/components/express-interest-button";
import { formatPrice } from "@/lib/format";
import type { Company } from "@/app/types/company";

type CompanyCardProps = {
  company: Company;
  interested?: boolean;
};

export function CompanyCard({ company, interested = false }: CompanyCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Link href={`/companies/${company.id}`} className="relative block h-44 bg-muted">
        {company.image_url ? (
          <Image
            src={company.image_url}
            alt={company.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Building2 className="h-10 w-10" />
          </div>
        )}
      </Link>

      <CardContent className="flex flex-1 flex-col gap-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/companies/${company.id}`} className="font-semibold hover:underline">
            {company.name}
          </Link>
          <Badge>{company.industry}</Badge>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {company.description || "No description provided."}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-lg font-semibold text-emerald-600">{formatPrice(company.price)}</p>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {company.interest_count ?? 0} interested
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <ExpressInterestButton
          className="w-full"
          companyId={company.id}
          sellerId={company.seller_id}
          alreadyInterested={interested}
        />
      </CardFooter>
    </Card>
  );
}
