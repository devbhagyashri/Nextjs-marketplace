"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type NavigationContextValue = {
  isNavigating: boolean;
  navigate: (href: string) => void;
};

const NavigationContext = createContext<NavigationContextValue>({
  isNavigating: false,
  navigate: () => {},
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    if (!isNavigating) {
      return;
    }

    const timeout = window.setTimeout(() => setIsNavigating(false), 8000);
    return () => window.clearTimeout(timeout);
  }, [isNavigating]);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) {
        return;
      }

      setIsNavigating(true);
      router.push(href);
    },
    [pathname, router]
  );

  return (
    <NavigationContext.Provider value={{ isNavigating, navigate }}>
      {children}
      {isNavigating && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-label="Loading page"
        >
          <div className="flex flex-col items-center gap-3 rounded-xl border bg-background px-8 py-6 shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading page...</p>
          </div>
        </div>
      )}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}
