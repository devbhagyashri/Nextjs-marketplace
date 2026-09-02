import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Company Marketplace
        </div>
        <p>A Next.js + Supabase demo for buying and selling companies.</p>
        <Link href="/sell" className="hover:text-foreground">
          List a company
        </Link>
      </div>
    </footer>
  );
}
