import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { DesktopNav, MobileNav } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KidsCare - Parent Portal",
  description: "Parent Portal for KidsCare",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 min-h-screen`}>
        <UserProvider>
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
        </UserProvider>
      </body>
    </html>
  );
}
