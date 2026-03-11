"use client";

import { DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {

  const router = useRouter();

  return (

    <div
      onClick={() => router.push(`/MarketPlace/products/${product._id}`)}
      className="bg-[#151921] border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-indigo-500 transition"
    >

      <img
        src={product.product_thumbnails}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />

      <h2 className="font-semibold text-lg mb-1">
        {product.title}
      </h2>

      <p className="text-slate-400 text-sm line-clamp-2 mb-2">
        {product.description}
      </p>

      <div className="flex items-center gap-1 text-emerald-400 font-semibold">
        <DollarSign size={16}/>
        {product.price}
      </div>

    </div>

  );
}