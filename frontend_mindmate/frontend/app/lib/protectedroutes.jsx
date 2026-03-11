"use client";

import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { authUser, logout, checkAuth, isCheckingAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    if (!authUser) router.push("/auth/Login");
  }, [checkAuth]);

  const isAuthenticated = !!authUser;
  return children;
}
