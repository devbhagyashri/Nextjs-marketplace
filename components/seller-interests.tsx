import { Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { formatDate } from "@/lib/format";
import type { CompanyInterest } from "@/app/types/company";

type SellerInterestsProps = {
  interests: CompanyInterest[];
};

export function SellerInterests({ interests }: SellerInterestsProps) {
  if (interests.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No buyer interest yet"
        description="When someone expresses interest in your listings, they will show up here."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/60 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Buyer email</th>
            <th className="px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {interests.map((interest) => (
            <tr key={interest.id} className="border-t">
              <td className="px-4 py-3">{interest.company_name}</td>
              <td className="px-4 py-3">{interest.buyer_email || "N/A"}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(interest.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
