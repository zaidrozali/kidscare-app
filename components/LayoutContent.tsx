"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DesktopNav, MobileNav } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const isLoginPage = pathname === "/login";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  // Show login page without auth check
  if (isLoginPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Regular pages with navigation (only for authenticated users)
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation - Hidden on mobile, visible on desktop */}
      <DesktopNav />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        <div className="w-full bg-white min-h-screen relative pb-20 lg:pb-0">
          {children}
        </div>
      </div>

      {/* Bottom Navigation Bar - Visible on mobile/tablet, hidden on desktop */}
      <MobileNav />
    </div>
  );
}
