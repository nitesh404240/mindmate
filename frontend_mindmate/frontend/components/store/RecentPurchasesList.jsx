"use client";
import { ShoppingBag, Calendar, User, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function RecentPurchasesList({ limit = 3 }) {
  // Mock data - Replace with your actual fetch logic later
  const purchases = [
    { _id: "1", title: "Quantum Physics Summary", seller: "Dr. Aris", price: "$4.99", date: "2024-05-20" },
    { _id: "2", title: "Advanced Calculus Guide", seller: "MathMaster", price: "$2.50", date: "2024-05-18" },
  ];

  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-600">
        <ShoppingBag size={32} className="mb-2 opacity-20" />
        <p className="text-sm italic">No purchases yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {purchases.slice(0, limit).map((item) => (
        <div 
          key={item._id}
          className="group flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl hover:border-indigo-500/40 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                  <User size={12} /> {item.seller}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                  <Calendar size={12} /> {item.date}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-indigo-400 font-black text-sm">{item.price}</p>
            <ArrowUpRight size={14} className="ml-auto mt-1 text-slate-600 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      ))}
    </div>
  );
}