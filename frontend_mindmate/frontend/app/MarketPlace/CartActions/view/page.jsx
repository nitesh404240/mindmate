"use client";

import { useEffect } from "react";
import { useCartStore } from "@/app/store/useCartStore";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const {
    items,
    fetchCart,
    updateQuantity,
    removeFromCart,
    totalAmount,
    isLoading
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  if ((!items || items.length === 0) && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#202c3f] items-center justify-center text-gray-400">
        <h1 className="text-3xl mb-6">Your Cart is Empty</h1>

        <button
          onClick={() => router.push("/MarketPlace/AllProduct")}
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg text-white"
        >
          Browse Store
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white pt-28 px-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">Shopping Cart</h1>

        <div className="grid md:grid-cols-3 gap-10">

          {/* PRODUCT CARDS */}

          <div className="md:col-span-2 space-y-6">

            {items.map((item) => (

              <div
                key={item.productId._id}
                className="bg-[#151921] border border-slate-700 rounded-2xl p-5 flex gap-6 items-center hover:border-indigo-500 transition"
              >

                {/* IMAGE */}

                <img
                  src={item.productId.product_thumbnails}
                  className="w-28 h-28 object-cover rounded-lg"
                />

                {/* INFO */}

                <div className="flex flex-col flex-1">

                  <h2 className="text-xl font-semibold">
                    {item.productId.title}
                  </h2>

                  <p className="text-gray-400 text-sm">
                    {item.productId.author}
                  </p>

                  <p className="text-emerald-400 font-semibold mt-2">
                    ${item.productId.price}
                  </p>

                  {/* QUANTITY */}

                  <div className="flex items-center gap-4 mt-4">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId._id,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 bg-slate-800 rounded-lg"
                    >
                      -
                    </button>

                    <span className="font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId._id,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 bg-slate-800 rounded-lg"
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* REMOVE */}

                <button
                  onClick={() => removeFromCart(item.productId._id)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 />
                </button>

              </div>

            ))}

          </div>

          {/* ORDER SUMMARY CARD */}

          <div className="bg-[#151921] border border-slate-700 rounded-2xl p-6 h-fit">

            <h2 className="text-2xl font-semibold mb-6">
              Order Summary
            </h2>

            <div className="flex justify-between mb-3 text-gray-400">
              <span>Items</span>
              <span>{items.length}</span>
            </div>

            <div className="flex justify-between text-xl font-semibold mb-6">
              <span>Total</span>
              <span className="text-emerald-400">
                ${totalAmount}
              </span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-semibold"
            >
              Proceed to Checkout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}