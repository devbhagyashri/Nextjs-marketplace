import type { Metadata } from "next";
import { SellerInterests } from "@/components/seller-interests";
import { getSellerInterests } from "@/lib/data";

export const metadata: Metadata = {
  title: "Buyer interest",
};

export default async function SellerInterestsPage() {
  const interests = await getSellerInterests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Interested buyers</h1>
        <p className="mt-2 text-muted-foreground">
          People who expressed interest in companies you listed.
        </p>
      </div>
      <SellerInterests interests={interests} />
    </div>
  );
}
