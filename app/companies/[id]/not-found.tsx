import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CompanyNotFound() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <h1 className="text-2xl font-semibold">Company not found</h1>
      <p className="mt-2 text-muted-foreground">This listing may have been removed.</p>
      <Button asChild className="mt-6">
        <Link href="/">Back to marketplace</Link>
      </Button>
    </div>
  );
}
