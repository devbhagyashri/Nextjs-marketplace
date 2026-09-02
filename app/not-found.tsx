import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">That route does not exist.</p>
      <Button asChild className="mt-6">
        <Link href="/">Back to marketplace</Link>
      </Button>
    </div>
  );
}
