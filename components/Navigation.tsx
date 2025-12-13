"use client";

import Link from "next/link";
import { Home, Newspaper, User, Shield } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export function DesktopNav() {
  const { isAdmin } = useUser();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 fixed h-full z-50">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">KidsCare</h2>
        <p className="text-sm text-gray-500">Parent Portal</p>
      </div>
      <nav className="flex-1 px-3 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-600 bg-blue-50 font-medium">
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link href="/feed" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">
          <Newspaper size={20} />
          <span>Feed</span>
        </Link>
        {isAdmin && (
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">
            <Shield size={20} />
            <span>Admin</span>
          </Link>
        )}
        <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">
          <User size={20} />
          <span>Account</span>
        </Link>
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const { isAdmin } = useUser();

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 flex justify-around py-3 pb-5 z-50 text-gray-400 text-xs font-medium">
      <Link href="/" className="flex flex-col items-center gap-1 text-blue-600">
        <Home size={24} />
        <span>HOME</span>
      </Link>
      <Link href="/feed" className="flex flex-col items-center gap-1 hover:text-blue-500">
        <Newspaper size={24} />
        <span>FEED</span>
      </Link>
      {isAdmin && (
        <Link href="/admin" className="flex flex-col items-center gap-1 hover:text-blue-500">
          <Shield size={24} />
          <span>ADMIN</span>
        </Link>
      )}
      <Link href="/account" className="flex flex-col items-center gap-1 hover:text-blue-500">
        <User size={24} />
        <span>ACCOUNT</span>
      </Link>
    </nav>
  );
}
