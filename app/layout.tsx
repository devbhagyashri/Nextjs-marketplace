import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { NavigationProvider } from "@/components/navigation-progress";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Company Marketplace",
    template: "%s | Company Marketplace",
  },
  description: "Browse, list, and acquire companies with Google authentication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <NavigationProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
              <Footer />
            </div>
          </NavigationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
