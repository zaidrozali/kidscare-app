"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { client } from "@/contexts/ApolloProvider";

export function useAuth() {
  const router = useRouter();
  const { setRole } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");

    if (token && userId && userName && userEmail && userRole) {
      setIsAuthenticated(true);
      setUser({
        id: userId,
        name: userName,
        email: userEmail,
        role: userRole,
      });
      setRole(userRole.toLowerCase() as "admin" | "parent");
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    // Update state immediately
    setIsAuthenticated(false);
    setUser(null);
    setRole("parent");

    // Clear Apollo Client cache to remove all cached data
    await client.clearStore();

    // Redirect to login page
    router.push("/login");
  };

  const requireAuth = (redirectTo: string = "/login") => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
    requireAuth,
    checkAuth,
  };
}
