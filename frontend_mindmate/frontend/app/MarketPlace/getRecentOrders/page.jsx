"use client";

import { useEffect, useState } from "react";
import { axiosinstance } from "@/app/lib/axios";
import Link from "next/link";
import { ShoppingBag, Calendar, MapPin, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  /* ---------------- FETCH ORDERS ---------------- */

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosinstance.get("/orders/my-orders");

        if (res?.data?.data?.orders) {
          setOrders(res.data.data.orders);
        }

      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="p-10 text-slate-400">
        Loading orders...
      </div>
    );
  }

  /* ---------------- EMPTY ---------------- */

  if (orders.length === 0) {
    return (
      <div className="p-10 text-center text-slate-500">
        <ShoppingBag className="mx-auto mb-3 opacity-30" size={40} />
        <p>You have no orders yet</p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-20">

      <h1 className="text-3xl font-bold mb-8">
        My Orders
      </h1>

      <div className="space-y-6">

        {orders.map((order) => (

          <div
            key={order._id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4"
          >

            {/* ORDER HEADER */}

            <div className="flex justify-between flex-wrap gap-4">

              <div className="text-sm text-gray-400 flex items-center gap-2">
                <Calendar size={14} />
                {new Date(order.createdAt).toLocaleDateString()}
              </div>

              <div className="text-sm px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                {order.paymentStatus}
              </div>

            </div>

            {/* PRODUCTS */}

            <div className="space-y-3">

              {order.products.map((product) => (

                <Link
                  key={product._id}
                  href={`/MarketPlace/products/${product.productId._id}`}
                >

                  <div className="flex justify-between items-center p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition">

                    <div className="flex items-center gap-3">

                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        <ShoppingBag size={16} />
                      </div>

                      <div>

                        <p className="font-semibold">
                          {product.productId?.title}
                        </p>

                        <p className="text-xs text-gray-400">
                          Quantity: {product.quantity}
                        </p>

                      </div>

                    </div>

                    <p className="font-bold text-indigo-400">
                      ₹{product.priceAtPurchase}
                    </p>

                  </div>

                </Link>

              ))}

            </div>

            {/* ADDRESS */}

            <div className="text-xs text-gray-400 flex items-start gap-2">
              <MapPin size={14} />

              <div>
                {order.address.fullName},{" "}
                {order.address.street},{" "}
                {order.address.city},{" "}
                {order.address.state}
              </div>

            </div>

            {/* TOTAL */}

            <div className="flex justify-between border-t border-zinc-800 pt-3">

              <span className="text-gray-400">
                Order Total
              </span>

              <span className="font-bold text-lg">
                ₹{order.totalAmount}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}