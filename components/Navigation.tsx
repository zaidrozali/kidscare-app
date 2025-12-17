"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, User, Shield, LogOut } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/hooks/useAuth";

export function DesktopNav() {
  const { isAdmin } = useUser();
  const { logout, user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
      isActive
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:bg-gray-50"
    }`;
  };

  // Don't render navigation if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 fixed h-full z-50">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">KidsCare</h2>
        <p className="text-sm text-gray-500">Parent Portal</p>
        {user && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">Signed in as</p>
            <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}
      </div>
      <nav className="flex-1 px-3 space-y-2">
        <Link href="/" className={getLinkClass("/")}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link href="/feed" className={getLinkClass("/feed")}>
          <Newspaper size={20} />
          <span>Feed</span>
        </Link>
        {isAdmin && (
          <Link href="/admin" className={getLinkClass("/admin")}>
            <Shield size={20} />
            <span>Admin</span>
          </Link>
        )}
        <Link href="/account" className={getLinkClass("/account")}>
          <User size={20} />
          <span>Account</span>
        </Link>
      </nav>
      <div className="p-3">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium w-full transition-colors"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const { isAdmin } = useUser();
  const { logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const getMobileLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex flex-col items-center gap-1 transition-colors ${
      isActive ? "text-blue-600" : "text-gray-400 hover:text-blue-500"
    }`;
  };

  // Don't render navigation if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 flex justify-around py-3 pb-5 z-50 text-xs font-medium">
      <Link href="/" className={getMobileLinkClass("/")}>
        <Home size={24} />
        <span>HOME</span>
      </Link>
      <Link href="/feed" className={getMobileLinkClass("/feed")}>
        <Newspaper size={24} />
        <span>FEED</span>
      </Link>
      {isAdmin && (
        <Link href="/admin" className={getMobileLinkClass("/admin")}>
          <Shield size={24} />
          <span>ADMIN</span>
        </Link>
      )}
      <Link href="/account" className={getMobileLinkClass("/account")}>
        <User size={24} />
        <span>ACCOUNT</span>
      </Link>
      <button
        onClick={logout}
        className="flex flex-col items-center gap-1 hover:text-red-500 text-red-600 transition-colors"
      >
        <LogOut size={24} />
        <span>LOGOUT</span>
      </button>
    </nav>
  );
}
