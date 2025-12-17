"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useUser } from "@/contexts/UserContext";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { LOGIN } from "@/lib/graphql-queries";

export default function LoginPage() {
  const { setRole } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: (data: any) => {
      // Store the token in localStorage
      localStorage.setItem("authToken", data.login.token);

      // Store user role
      const role = data.login.user.role;
      const roleLower = role.toLowerCase();
      setRole(roleLower as "admin" | "parent");

      // Store user info
      localStorage.setItem("userId", data.login.user.id);
      localStorage.setItem("userName", data.login.user.name);
      localStorage.setItem("userEmail", data.login.user.email);
      localStorage.setItem("userRole", role); // Store original role for auth hook

      // Redirect based on role - use window.location for full page reload
      if (roleLower === "admin" || roleLower === "tenant_admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      await login({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to KidsCare</h1>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@kidscare.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-700">Admin Account:</p>
                <p>Email: admin@kidscare.com</p>
                <p>Password: admin123</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-700">Parent Account:</p>
                <p>Email: parent1@example.com</p>
                <p>Password: parent123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help? Contact your administrator
        </p>
      </div>
    </div>
  );
}
