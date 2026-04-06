"use client";

import { ShoppingBag, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { axiosinstance } from "@/app/lib/axios";
import { useEffect, useState } from "react";

export default function RecentPurchasesList({ limit = 3 }) {

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosinstance.get("/orders/my-orders");

        if (res?.data?.data?.orders) {
          setPurchases(res.data.data.orders);
        }

      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-slate-500 text-sm">Loading purchases...</div>;
  }

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

      {purchases.slice(0, limit).map((order) =>
        order.products.map((product) => (

          <Link
      key={product._id}
      href={`/MarketPlace/getRecentOrders/${order._id}`}
    >

            <div className="group flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl hover:border-indigo-500/40 transition-all cursor-pointer">

              <div className="flex items-center gap-4">

                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <ShoppingBag size={18} />
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                    {product.productId?.title}
                  </h4>

                  <div className="flex items-center gap-3 mt-1">

                    <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>

                  </div>
                </div>

              </div>

              <div className="text-right">

                <p className="text-indigo-400 font-black text-sm">
                  ₹{product.priceAtPurchase}
                </p>

                <ArrowUpRight
                  size={14}
                  className="ml-auto mt-1 text-slate-600 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />

              </div>

            </div>

          </Link>

        ))
      )}

    </div>
  );
}