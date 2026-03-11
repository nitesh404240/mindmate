"use client"
import Hero from "@/components/Hero";
import { useAuthStore } from "./store/useAuthStore";
import DashboardPage from "./Dashboard/page"; // Ensure this matches your folder name

export default function Home() {
  const { authUser } = useAuthStore();

  return (
    <div>
      {/* If authUser exists, show Dashboard. Otherwise, show Hero */}
      {authUser ? <DashboardPage /> : <Hero />}
    </div>
  );
}