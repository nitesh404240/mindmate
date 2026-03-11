"use client";

import {
  Package,
  DollarSign,
  ShoppingCart,
  Plus,
  MoreHorizontal,
  TrendingUp,
  Bell,
} from "lucide-react";

import StatCard from "./StatCard";
import { useRouter } from "next/navigation";

export default function SellerDashBoard({ user }: { user: any }) {
  const router = useRouter();

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#0f1117] via-[#11131a] to-[#0b0d12] px-8 py-10">

      {/* HEADER */}
      <header className="flex items-center justify-between mb-12">

        <div className="flex items-center gap-5">

          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg">
            {user?.Username?.charAt(0) || "U"}
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Seller Studio
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Welcome back, {user?.Username}. Manage your marketplace products.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-4">

          {/* Notification */}
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1a1e27] border border-slate-800 hover:bg-[#202531] transition">
            <Bell size={18} />
          </button>

          {/* CREATE PRODUCT */}
          <button
            onClick={() => router.push("/MarketPlace/create-product")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Plus size={18} />
            Create Product
          </button>
        </div>

      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">

        <StatCard
          label="Total Revenue"
          value="$1,240"
          icon={DollarSign}
          colorClass="text-emerald-400"
          trend="+12%"
        />

        <StatCard
          label="Orders"
          value="48"
          icon={ShoppingCart}
          colorClass="text-blue-400"
          trend="+5%"
        />

        <StatCard
          label="Products"
          value="12"
          icon={Package}
          colorClass="text-indigo-400"
        />

      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-3 gap-6 mb-14">

        <div
          onClick={() => router.push("/MarketPlace/create-product")}
          className="cursor-pointer bg-[#151921] border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition"
        >
          <Plus className="text-indigo-400 mb-3" />
          <h3 className="font-semibold text-lg">Add New Product</h3>
          <p className="text-sm text-slate-400 mt-1">
            Upload and publish a new product to your store.
          </p>
        </div>

        <div
          onClick={() => router.push("/MarketPlace/sellerproducts")}
          className="cursor-pointer bg-[#151921] border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition"
        >
          <Package className="text-indigo-400 mb-3" />
          <h3 className="font-semibold text-lg">Manage Products</h3>
          <p className="text-sm text-slate-400 mt-1">
            View, edit or delete your listings.
          </p>
        </div>

        <div className="bg-[#151921] border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition">
          <TrendingUp className="text-indigo-400 mb-3" />
          <h3 className="font-semibold text-lg">View Analytics</h3>
          <p className="text-sm text-slate-400 mt-1">
            Track performance and sales insights.
          </p>
        </div>

      </div>

      {/* RECENT PRODUCTS */}
      <div className="bg-[#151921] rounded-2xl border border-slate-800 overflow-hidden shadow-lg">

        <div className="flex items-center justify-between p-6 border-b border-slate-800">

          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp size={18} />
            Your Active Listings
          </h2>

          <button
            onClick={() => router.push("/MarketPlace/sellerproducts")}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            View all
          </button>

        </div>

        {/* PRODUCT LIST */}
        <div className="divide-y divide-slate-800">

          <div className="flex items-center justify-between p-6 hover:bg-slate-800/30 transition">

            <div className="flex items-center gap-4">

              {/* Product Thumbnail */}
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-semibold">
                PDF
              </div>

              <div>
                <p className="font-semibold">
                  Calculus III Master Notes
                </p>

                <p className="text-xs text-slate-500">
                  24 Sales • $12.00
                </p>
              </div>

            </div>

            <MoreHorizontal className="text-slate-500 hover:text-white cursor-pointer" />

          </div>

        </div>

      </div>

    </div>
  );
}