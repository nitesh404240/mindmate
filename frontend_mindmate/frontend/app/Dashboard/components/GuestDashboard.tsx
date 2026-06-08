"use client";

import {
  Sparkles,
  Brain,
  BookOpen,
  Shield,
  ArrowRight,
  UserPlus,
  LogIn,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function GuestDashboard() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-[#151921] p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-transparent to-purple-600/10" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            AI Powered Learning
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-black text-white leading-tight">
            Build Your
            <span className="text-indigo-400"> Second Brain</span>
          </h1>

          <p className="mt-4 text-slate-400 text-lg leading-relaxed">
            Capture notes, organize knowledge, generate AI insights,
            and access premium study resources — all in one place.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={() => router.push("auth/Register")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
            >
              <UserPlus size={18} />
              Get Started
            </button>

            <button
              onClick={() => router.push("auth/Login")}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
            >
              <LogIn size={18} />
              Login
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Brain size={24} />}
          title="AI Research Lab"
          description="Generate deep insights, summaries, and study notes using AI."
        />

        <FeatureCard
          icon={<BookOpen size={24} />}
          title="Smart Notes"
          description="Create, organize, search and revisit your knowledge effortlessly."
        />

        <FeatureCard
          icon={<Shield size={24} />}
          title="Marketplace Access"
          description="Purchase premium notes, guides, and curated learning resources."
        />
      </section>

      {/* PREVIEW SECTION */}
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#151921] border border-slate-800 rounded-[2rem] p-8">
          <p className="text-indigo-400 text-xs font-black tracking-widest uppercase">
            Why Join?
          </p>

          <h2 className="text-2xl font-black text-white mt-3">
            Everything synced in one place
          </h2>

          <ul className="mt-6 space-y-4 text-slate-400">
            <li>✓ Unlimited note organization</li>
            <li>✓ AI generated summaries</li>
            <li>✓ Smart search across notes</li>
            <li>✓ Premium marketplace access</li>
            <li>✓ Cloud synchronization</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-[2rem] p-8 flex flex-col justify-center">
          <h3 className="text-3xl font-black text-white">
            Start Learning Smarter
          </h3>

          <p className="mt-3 text-slate-300">
            Join thousands of students using MindMate to build
            their personal knowledge system.
          </p>

          <button
            onClick={() => router.push("/register")}
            className="mt-8 w-fit flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-all"
          >
            Create Free Account
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#151921] border border-slate-800 rounded-[2rem] p-6 hover:border-indigo-500/40 transition-all">
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>
    </div>
  );
}