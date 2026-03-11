"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import SellerDashBoard from "./components/SellerDashBoard";
import StudentDashBoard from "./components/StudentDashBoard";

export default function DashBoardPage() {
  const { authUser,checkAuth } = useAuthStore();
  const [hasMounted, setHasMounted] = useState(false);

  // Fixes the JSX/TSX hydration mismatch
  useEffect(() => {
    setHasMounted(true);
    checkAuth();
  }, []);

  if (!hasMounted) return null; 

  // Professional check: If no user, don't just return null, redirect or show login
  if (!authUser) return <div>Loading account...</div>;

 const isSeller = authUser?.role === "seller";
console.log(authUser?.role);
  return (
    <div className="min-h-screen pt-20 p-5 bg-[#0B0F1A] text-white">
      {isSeller ? (
        <SellerDashBoard user={authUser} />
      ) : (
        <StudentDashBoard user={authUser} />
      )}
    </div>
  );
}