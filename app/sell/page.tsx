import type { Metadata } from "next";
import { SellCompanyForm } from "@/components/sell-company-form";

export const metadata: Metadata = {
  title: "Sell a company",
};

export default function SellPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create a listing</h1>
        <p className="mt-2 text-muted-foreground">
          Add your company details and a cover image. Buyers can express interest after you publish.
        </p>
      </div>
      <SellCompanyForm />
    </div>
  );
}
