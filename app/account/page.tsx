"use client";

import { useUser } from "@/contexts/UserContext";
import { User, Shield, Check } from "lucide-react";

export default function AccountPage() {
  const { role, setRole, isAdmin } = useUser();

  return (
    <div className="bg-gray-50 min-h-full pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 text-white p-6 pb-16 lg:pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold">Account Settings</h1>
          <p className="text-sm lg:text-base opacity-90 mt-1">Manage your profile and preferences</p>
        </div>
      </div>

      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6 -mt-8">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Muhammad Zaid</h2>
              <p className="text-sm lg:text-base text-gray-500">zaid@kidscare.com</p>
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  isAdmin
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  {isAdmin ? "Administrator" : "Parent"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Phone:</span> +60 12-345 6789</p>
              <p><span className="font-medium">Address:</span> Selangor, Malaysia</p>
            </div>
          </div>
        </div>

        {/* Role Switcher - Demo Only */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Switch Role</h3>
              <p className="text-sm text-gray-500 mt-1">For demo purposes only</p>
            </div>
            <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
              DEMO MODE
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Parent Role */}
            <button
              onClick={() => setRole("parent")}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                role === "parent"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              {role === "parent" && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  role === "parent" ? "bg-blue-500" : "bg-gray-200"
                }`}>
                  <User className={`w-6 h-6 ${role === "parent" ? "text-white" : "text-gray-600"}`} />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-gray-800">Parent</h4>
                  <p className="text-xs text-gray-500 mt-1">View child activities and updates</p>
                </div>
              </div>
            </button>

            {/* Admin Role */}
            <button
              onClick={() => setRole("admin")}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                role === "admin"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              {role === "admin" && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  role === "admin" ? "bg-purple-500" : "bg-gray-200"
                }`}>
                  <Shield className={`w-6 h-6 ${role === "admin" ? "text-white" : "text-gray-600"}`} />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-gray-800">Administrator</h4>
                  <p className="text-xs text-gray-500 mt-1">Upload activities and manage content</p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Current role:</span> {isAdmin ? "Administrator" : "Parent"}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {isAdmin
                ? "You can now access the Admin dashboard to upload activities."
                : "Switch to Admin to access the Admin dashboard and upload features."}
            </p>
          </div>
        </div>

        {/* Children Information (Only for Parents) */}
        {!isAdmin && (
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4">My Children</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-pink-700">E</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Eryna Binti Muhammad Zaid</h4>
                  <p className="text-sm text-gray-500">Class: Junior</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
