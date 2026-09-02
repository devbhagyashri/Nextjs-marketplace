"use client";

import Link from "next/link";
import { useMemo, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { useNavigation } from "@/components/navigation-progress";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Browse" },
  { href: "/sell", label: "Sell", auth: true },
  { href: "/my-listings", label: "My listings", auth: true },
  { href: "/seller/interests", label: "Buyer interest", auth: true },
];

export function Navbar() {
  const { user, loading } = useAuth();
  const { isNavigating, navigate } = useNavigation();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    navigate(href);
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          onClick={(event) => handleNavClick(event, "/")}
          className="flex items-center gap-2 font-semibold"
        >
          {isNavigating ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <Building2 className="h-5 w-5 text-primary" />
          )}
          Marketplace
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks
            .filter((link) => !link.auth || user)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm transition-colors hover:text-foreground",
                  pathname === link.href
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : user ? (
            <>
              <span className="hidden max-w-[180px] truncate text-sm text-muted-foreground sm:block">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={signInWithGoogle}>
              Sign in with Google
            </Button>
          )}
        </div>
      </div>

      {user && (
        <div className="flex gap-4 overflow-x-auto border-t px-4 py-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              className={cn(
                "whitespace-nowrap text-sm",
                pathname === link.href ? "font-semibold" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
