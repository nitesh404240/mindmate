"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosinstance } from "@/app/lib/axios";
import {
  ShoppingBag,
  Calendar,
  MapPin,
  ArrowLeft,
  BookOpen,
} from "lucide-react";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosinstance.get(`/orders/${id}`);
        console.log(res);

        setOrder(res.data.data.order);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-gray-400">Loading order...</div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-red-400">Order not found</div>
    );
  }

  const statusColor =
    order.paymentStatus === "paid"
      ? "bg-green-500/20 text-green-400"
      : "bg-yellow-500/20 text-yellow-400";

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-20  mx-auto space-y-8">
      
      {/* HEADER */}

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-2xl font-bold">
          Order Details
        </h1>
      </div>

      {/* ORDER SUMMARY */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">

        <div className="flex justify-between flex-wrap gap-4">

          <div className="text-sm text-gray-400 flex items-center gap-2">
            <Calendar size={14} />
            {new Date(order.createdAt).toLocaleDateString()}
          </div>

          <div className={`px-3 py-1 text-xs rounded-full ${statusColor}`}>
            {order.paymentStatus}
          </div>

        </div>

        <p className="text-xs text-gray-500">
          Order ID: {order._id}
        </p>

      </div>

      {/* PURCHASED ITEMS */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShoppingBag size={18} />
          Purchased Items
        </h2>

        <div className="space-y-4">

          {order.products.map((product) => (

            <div
              key={product._id}
              className="flex justify-between items-center p-4 bg-zinc-800 rounded-xl"
            >

              <div className="space-y-1">

                <p className="font-semibold">
                  {product.productId?.title}
                </p>

                <p className="text-xs text-gray-400">
                  Quantity: {product.quantity}
                </p>

              </div>

              <div className="flex items-center gap-6">

                <p className="text-indigo-400 font-bold">
                  ₹{product.priceAtPurchase}
                </p>

                <button
                  onClick={() =>
                    router.push(`/library/${product.productId._id}`)
                  }
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm"
                >
                  <BookOpen size={14} />
                  Open Note
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ADDRESS */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin size={18} />
          Delivery Address
        </h2>

        <p className="text-gray-300">
          {order.address.fullName}
        </p>

        <p className="text-gray-400 text-sm">
          {order.address.street}, {order.address.city}
        </p>

        <p className="text-gray-400 text-sm">
          {order.address.state} - {order.address.pincode}
        </p>

      </div>

      {/* TOTAL */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex justify-between items-center">

        <span className="text-gray-400">
          Total Amount
        </span>

        <span className="text-xl font-bold">
          ₹{order.totalAmount}
        </span>

      </div>

    </div>
  );
}