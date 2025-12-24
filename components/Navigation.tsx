"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, User, Shield, LogOut } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/hooks/useAuth";

export function DesktopNav() {
  const { isAdmin } = useUser();
  const { logout, user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
        ? "text-indigo-600 bg-indigo-50"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`;
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200 fixed h-full z-50">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">KidsCare</span>
          </div>
        </div>

        <div className="px-4 py-6">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
          <nav className="space-y-1">
            <Link href="/" className={getLinkClass("/")}>
              <Home size={18} strokeWidth={2} />
              <span>Dashboard</span>
            </Link>
            <Link href="/feed" className={getLinkClass("/feed")}>
              <Newspaper size={18} strokeWidth={2} />
              <span>Feed</span>
            </Link>
            {isAdmin && (
              <Link href="/admin" className={getLinkClass("/admin")}>
                <Shield size={18} strokeWidth={2} />
                <span>Admin</span>
              </Link>
            )}
            <Link href="/account" className={getLinkClass("/account")}>
              <User size={18} strokeWidth={2} />
              <span>Account</span>
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-100">
          {user && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-xs">
                {user.name?.[0] || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} strokeWidth={2} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Modal - Clean V2 */}
      {showLogoutConfirm && (
        <LogoutModal
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={handleConfirmLogout}
          isLoggingOut={isLoggingOut}
        />
      )}
    </>
  );
}

export function MobileNav() {
  const { isAdmin } = useUser();
  const { logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getMobileLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex flex-col items-center justify-center w-full h-full gap-1 ${isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
      }`;
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-slate-200 flex justify-between items-center h-16 px-2 z-50">
        <Link href="/" className={getMobileLinkClass("/")}>
          <Home size={24} strokeWidth={pathname === "/" ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link href="/feed" className={getMobileLinkClass("/feed")}>
          <Newspaper size={24} strokeWidth={pathname === "/feed" ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Feed</span>
        </Link>

        {isAdmin && (
          <Link href="/admin" className={getMobileLinkClass("/admin")}>
            <Shield size={24} strokeWidth={pathname === "/admin" ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Admin</span>
          </Link>
        )}

        <Link href="/account" className={getMobileLinkClass("/account")}>
          <User size={24} strokeWidth={pathname === "/account" ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Account</span>
        </Link>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-slate-400 active:text-red-500"
        >
          <LogOut size={24} strokeWidth={2} />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </nav>

      {showLogoutConfirm && (
        <LogoutModal
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={handleConfirmLogout}
          isLoggingOut={isLoggingOut}
        />
      )}
    </>
  );
}

function LogoutModal({ onCancel, onConfirm, isLoggingOut }: { onCancel: () => void, onConfirm: () => void, isLoggingOut: boolean }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Sign Out</h3>
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to sign out? You will need to sign in again to access your account.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoggingOut}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            {isLoggingOut && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
