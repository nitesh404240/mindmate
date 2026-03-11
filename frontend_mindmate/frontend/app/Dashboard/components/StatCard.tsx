"use client";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon; // Changed 'any' to 'LucideIcon' for better TS support
  colorClass: string;
  trend?: string;
}

export default function StatCard({ label, value, icon: Icon, colorClass, trend }: StatCardProps) {
  return (
    <div className="bg-[#1b1f2c] border border-slate-800/50 p-6 rounded-2xl hover:bg-[#161B26] hover:border-indigo-500/30 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-indigo-500/50 transition-colors ${colorClass}`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        {trend && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">{label}</p>
        <h3 className="text-3xl font-bold mt-1 text-white tracking-tight">{value}</h3>
      </div>
    </div>
  );
}