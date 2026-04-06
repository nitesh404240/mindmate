"use client";
import {
  BookOpen,
  Search,
  Sparkles,
  FileText,
  Plus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import StatCard from "./StatCard";
import RecentNotesList from "@/components/notes/RecentNotesList";
import CreateNoteCard from "@/components/notes/CreateNoteCard";
import RecentPurchasesList from "@/components/store/RecentPurchasesList";
import { useNotesStore } from "@/app/store/useNotesStore";
import { useEffect, useState } from "react";
import { axiosinstance } from "@/app/lib/axios";

export default function StudentDashboard({ user }: { user: any }) {
  const { notes, fetchNotes } = useNotesStore();
  const router = useRouter();

  const [purchaseCount, setPurchaseCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axiosinstance.get("/orders/my-orders");

      const orders = res?.data?.data?.orders || [];

      const count = orders.reduce(
        (total: { total: any }, order: { order: any }) => {
          return total + order.products.length;
        },
        0,
      );

      setPurchaseCount(count);
    };

    fetchOrders();
  }, []);
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div className="animate-in fade-in duration-700 max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* --- HEADER --- */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white capitalize tracking-tight">
            Hello, {user?.Username || "Explorer"} 👋
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Ready to expand your second brain?
          </p>
        </div>

        {/* Search & Action Group */}
        <div className="flex items-center gap-3 flex-1 md:max-w-xl">
          {/* Search Bar - Flex 1 allows it to take remaining space */}
          <div className="relative flex-1 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
              size={16}
            />
            <input
              className="w-full bg-[#151921] border border-slate-800/60 rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-white transition-all shadow-inner"
              placeholder="Search your mind..."
            />
          </div>

          {/* Create Note Button - shrink-0 prevents it from hiding */}
          <button
            onClick={() => router.push("/notes/new")}
            className="shrink-0 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/10"
          >
            <Plus size={16} />{" "}
            <span className="hidden sm:inline">Create Note</span>
          </button>
        </div>
      </header>
      {/* --- PRIMARY ACTION ROW (FIXED) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Main Creation Card (2/3) */}
        <div className="lg:col-span-2">
          <CreateNoteCard />
        </div>

        {/* AI Research Lab (1/3) - Now matched to the blue section height */}
        <div
          onClick={() => router.push("/ai")}
          className="group cursor-pointer relative overflow-hidden bg-[#151921] border border-slate-800/60 rounded-[2rem] px-6 flex items-center justify-between transition-all hover:border-indigo-500/50 hover:bg-indigo-600/5 shadow-inner"
        >
          {/* Subtle Glow Effect */}
          <div className="absolute -right-4 w-20 h-20 bg-indigo-600/10 blur-3xl group-hover:bg-indigo-600/20 transition-all" />

          <div className="flex items-center gap-4 z-10">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
              <Sparkles className="text-white" size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-black uppercase tracking-widest text-[10px] text-indigo-400">
                ai INSIGHT
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Generate deep-dive notes
              </p>
            </div>
          </div>

          <div className="z-10 bg-slate-800/50 p-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <ArrowRight
              size={14}
              className="text-slate-400 group-hover:text-white"
            />
          </div>
        </div>
      </div>
      {/* --- MIDDLE ROW: STATS & MARKETPLACE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
        {/* Left: Stats Column */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <StatCard
            label="Total Notes"
            value={notes.length}
            icon={FileText}
            colorClass="text-indigo-400"
          />
          <button
          onClick={()=>router.push("/MarketPlace/getRecentOrders")}>
             <StatCard
            label="Purchased"
           
            value={purchaseCount}
            icon={BookOpen}
            colorClass="text-purple-400"
          />
          
          </button>
         

          {/* Marketplace Sidebar */}
          <div className="col-span-2 bg-[#151921] border border-slate-800/60 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <ShoppingBag size={18} className="text-purple-500" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">
                  MindMate Marketplace
                </h3>
              </div>
              <button
                onClick={() => router.push("/MarketPlace/AllProduct")}
                className="text-[10px] font-black text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all"
              >
                BROWSE <ArrowRight size={12} />
              </button>
            </div>
            <RecentPurchasesList limit={2} />
          </div>
        </div>

        {/* Right: Recent Notes */}
        <div className="lg:col-span-7">
          <div className="bg-[#151921] border border-slate-800/60 rounded-[2rem] p-6 h-full shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black flex items-center gap-3 text-white uppercase tracking-widest">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <FileText size={18} className="text-indigo-500" />
                </div>
                Recent Notes
              </h3>
              <button
                onClick={() => router.push("/notes")}
                className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors"
              >
                See All
              </button>
            </div>
            <RecentNotesList limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
