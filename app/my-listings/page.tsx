import type { Metadata } from "next";
import { MyListings } from "@/components/my-listings";
import { getMyCompanies } from "@/lib/data";

export const metadata: Metadata = {
  title: "My listings",
};

export default async function MyListingsPage() {
  const companies = await getMyCompanies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My listings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage the companies you have listed for sale.
        </p>
      </div>
      <MyListings initialCompanies={companies} />
    </div>
  );
}
